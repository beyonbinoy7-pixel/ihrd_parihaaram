package org.ihrd.parihaaram;

import org.ihrd.parihaaram.dto.ComplaintResponseDto;
import org.ihrd.parihaaram.dto.CreateComplaintRequest;
import org.ihrd.parihaaram.dto.RegisterStudentRequest;
import org.ihrd.parihaaram.exception.UnauthorizedException;
import org.ihrd.parihaaram.model.User;
import org.ihrd.parihaaram.repository.UserRepository;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.ihrd.parihaaram.service.AuthService;
import org.ihrd.parihaaram.service.ComplaintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CollegeIsolationTest {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    private CustomUserDetails stu001Cek;
    private CustomUserDetails admin001Cek;
    private CustomUserDetails admin002Cec;

    @BeforeEach
    public void setup() {
        User student = userRepository.findById("STU001").orElseThrow();
        User adminCek = userRepository.findById("ADMIN001").orElseThrow();
        User adminCec = userRepository.findById("ADMIN002").orElseThrow();

        this.stu001Cek = new CustomUserDetails(student);
        this.admin001Cek = new CustomUserDetails(adminCek);
        this.admin002Cec = new CustomUserDetails(adminCec);
    }

    @Test
    public void testCrossCollegeRoutingAndAdminIsolation() {
        // 1. CEK Student reports problem observed at CEC campus
        CreateComplaintRequest request = new CreateComplaintRequest();
        request.setTitle("Damaged Projector Screen in Seminar Hall");
        request.setDescription("Observed during inter-college symposium at CEC campus");
        request.setCategory("Electrical");
        request.setTargetCollege("CEC"); // Targeted to CEC

        ComplaintResponseDto created = complaintService.createComplaint(request, stu001Cek);
        assertEquals("CEK", created.getReporterCollegeCode());
        assertEquals("CEC", created.getTargetCollegeCode());
        assertEquals("OTHER_COLLEGE", created.getReportType());
        assertTrue(created.getTicketId().startsWith("CE-CEC-2026-"));

        // 2. CEC Admin (ADMIN002) checks their feed -> MUST see the complaint
        List<ComplaintResponseDto> cecFeed = complaintService.getAdminComplaints(admin002Cec);
        boolean cecSeesIt = cecFeed.stream().anyMatch(c -> c.getId().equals(created.getId()));
        assertTrue(cecSeesIt, "CEC Admin must receive complaints targeted to CEC");

        // 3. CEK Admin (ADMIN001) checks their feed -> MUST NOT see the complaint
        List<ComplaintResponseDto> cekFeed = complaintService.getAdminComplaints(admin001Cek);
        boolean cekSeesIt = cekFeed.stream().anyMatch(c -> c.getId().equals(created.getId()));
        assertFalse(cekSeesIt, "CEK Admin must NOT receive complaints targeted to CEC even if reporter is from CEK");

        // 4. CEK Admin attempting direct ID access to CEC complaint -> MUST fail with UnauthorizedException
        assertThrows(UnauthorizedException.class, () -> {
            complaintService.getAdminComplaintById(created.getId(), admin001Cek);
        });

        // 5. CEC Admin direct ID access -> SUCCESS
        ComplaintResponseDto cecFetch = complaintService.getAdminComplaintById(created.getId(), admin002Cec);
        assertNotNull(cecFetch);
        assertEquals(created.getId(), cecFetch.getId());
    }

    @Test
    public void testStudentOwnershipEnforcement() {
        // Register Student B
        RegisterStudentRequest regReq = new RegisterStudentRequest();
        regReq.setStudentId("STU_OTHER_88");
        regReq.setName("Student B");
        regReq.setEmail("student_b@pariharam.demo");
        regReq.setPassword("password123");
        regReq.setCollegeCode("CEK");
        authService.registerStudent(regReq);

        User studentB = userRepository.findById("STU_OTHER_88").orElseThrow();
        CustomUserDetails userB = new CustomUserDetails(studentB);

        // Student A creates complaint
        CreateComplaintRequest request = new CreateComplaintRequest();
        request.setTitle("Student A Private Grievance");
        request.setDescription("Confidential report");
        request.setCategory("Infrastructure");
        request.setTargetCollege("CEK");
        ComplaintResponseDto complaintA = complaintService.createComplaint(request, stu001Cek);

        // Student B attempting to view Student A's complaint -> MUST throw UnauthorizedException
        assertThrows(UnauthorizedException.class, () -> {
            complaintService.getStudentComplaintById(complaintA.getId(), userB);
        });
    }
}
