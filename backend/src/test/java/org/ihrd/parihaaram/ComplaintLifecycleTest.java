package org.ihrd.parihaaram;

import org.ihrd.parihaaram.dto.*;
import org.ihrd.parihaaram.exception.InvalidStatusTransitionException;
import org.ihrd.parihaaram.model.ComplaintStatus;
import org.ihrd.parihaaram.model.Role;
import org.ihrd.parihaaram.model.User;
import org.ihrd.parihaaram.repository.UserRepository;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.ihrd.parihaaram.service.ComplaintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ComplaintLifecycleTest {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    private CustomUserDetails studentUser;
    private CustomUserDetails adminUser;

    @BeforeEach
    public void setup() {
        User student = userRepository.findById("STU001").orElseThrow();
        User admin = userRepository.findById("ADMIN001").orElseThrow();
        this.studentUser = new CustomUserDetails(student);
        this.adminUser = new CustomUserDetails(admin);
    }

    @Test
    public void testFullComplaintLifecycleAndTimeline() {
        // 1. Student creates complaint
        CreateComplaintRequest createReq = new CreateComplaintRequest();
        createReq.setTitle("Library Air Conditioner Faulty");
        createReq.setDescription("AC unit in reading room 2 is leaking water");
        createReq.setCategory("Electrical");
        createReq.setCategoryId("electrical");
        createReq.setBuilding("Library Block");
        createReq.setRoom("Reading Room 2");
        createReq.setStudentPriority("HIGH");
        createReq.setTargetCollege("CEK");

        ComplaintResponseDto created = complaintService.createComplaint(createReq, studentUser);
        assertNotNull(created.getId());
        assertTrue(created.getTicketId().startsWith("CE-CEK-2026-"));
        assertEquals(ComplaintStatus.SUBMITTED, created.getStatus());
        assertEquals(1, created.getTimeline().size());
        assertEquals("SUBMITTED", created.getTimeline().get(0).getToStatus());

        // 2. Admin moves to UNDER_REVIEW
        StatusTransitionRequest reviewReq = new StatusTransitionRequest();
        reviewReq.setStatus(ComplaintStatus.UNDER_REVIEW);
        reviewReq.setComment("Campus supervisor dispatched to inspect");
        ComplaintResponseDto reviewed = complaintService.updateComplaintStatus(created.getId(), reviewReq, adminUser);
        assertEquals(ComplaintStatus.UNDER_REVIEW, reviewed.getStatus());
        assertEquals(2, reviewed.getTimeline().size());

        // 3. Admin assigns / moves to IN_PROGRESS
        User faculty = userRepository.findById("FAC_TEST")
                .orElseGet(() -> userRepository.save(new User(
                        "FAC_TEST",
                        "FAC_TEST",
                        "faculty.test@pariharam.demo",
                        "test-password-hash",
                        "Integration Test Faculty",
                        Role.FACULTY,
                        "CEK"
                )));
        AssignComplaintRequest assignReq = new AssignComplaintRequest();
        assignReq.setDepartment("HVAC Maintenance");
        assignReq.setFacultyId(faculty.getId());
        ComplaintResponseDto inProgress = complaintService.assignComplaint(created.getId(), assignReq, adminUser);
        assertEquals(ComplaintStatus.IN_PROGRESS, inProgress.getStatus());
        assertEquals(faculty.getId(), inProgress.getAssignedFacultyId());

        // 4. Admin completes fix and marks RESOLVED with evidence
        StatusTransitionRequest resolveReq = new StatusTransitionRequest();
        resolveReq.setStatus(ComplaintStatus.RESOLVED);
        resolveReq.setResolutionDescription("Cleaned drainage tray and replaced filter unit.");
        resolveReq.setResolutionImages(List.of("/api/evidence/ac_fixed_proof.jpg"));
        ComplaintResponseDto resolved = complaintService.updateComplaintStatus(created.getId(), resolveReq, adminUser);
        assertEquals(ComplaintStatus.RESOLVED, resolved.getStatus());
        assertNotNull(resolved.getResolvedAt());

        // 5. Student confirms resolution -> CLOSED
        StudentVerifyRequest verifyReq = new StudentVerifyRequest();
        verifyReq.setRating(5);
        verifyReq.setComment("AC is working perfectly now, thank you!");
        ComplaintResponseDto closed = complaintService.studentVerifyResolution(created.getId(), verifyReq, studentUser);
        assertEquals(ComplaintStatus.CLOSED, closed.getStatus());
        assertNotNull(closed.getClosedAt());
        assertEquals(5, closed.getRating());
        assertTrue(closed.getTimeline().size() >= 5);
    }

    @Test
    public void testInvalidStatusTransitionRejected() {
        CreateComplaintRequest createReq = new CreateComplaintRequest();
        createReq.setTitle("Broken Window Latch");
        createReq.setDescription("Window latch broken in Room 101");
        createReq.setCategory("Infrastructure");
        createReq.setTargetCollege("CEK");

        ComplaintResponseDto created = complaintService.createComplaint(createReq, studentUser);

        // Attempting to move SUBMITTED directly to RESOLVED without IN_PROGRESS
        StatusTransitionRequest invalidReq = new StatusTransitionRequest();
        invalidReq.setStatus(ComplaintStatus.RESOLVED);

        assertThrows(InvalidStatusTransitionException.class, () -> {
            complaintService.updateComplaintStatus(created.getId(), invalidReq, adminUser);
        });
    }
}
