package org.ihrd.parihaaram;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.ihrd.parihaaram.dto.LoginRequest;
import org.ihrd.parihaaram.dto.RegisterStudentRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testValidStudentLogin() throws Exception {
        LoginRequest request = new LoginRequest("STU001", "student123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andExpect(jsonPath("$.data.user.role").value("STUDENT"))
                .andExpect(jsonPath("$.data.user.collegeCode").value("CEK"));
    }

    @Test
    public void testInvalidPasswordLoginFails() throws Exception {
        LoginRequest request = new LoginRequest("STU001", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    public void testValidAdminLogin() throws Exception {
        LoginRequest request = new LoginRequest("ADMIN001", "admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.role").value("COLLEGE_ADMIN"))
                .andExpect(jsonPath("$.data.user.collegeCode").value("CEK"));
    }

    @Test
    public void testRegisterNewStudent() throws Exception {
        RegisterStudentRequest request = new RegisterStudentRequest();
        request.setStudentId("STU_TEST_99");
        request.setName("Integration Test Student");
        request.setEmail("stu_test_99@pariharam.demo");
        request.setPassword("securePassword123");
        request.setCollegeCode("CEC");
        request.setDepartment("ECE");
        request.setYear(2);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.studentId").value("STU_TEST_99"))
                .andExpect(jsonPath("$.data.user.role").value("STUDENT"));
    }

    @Test
    public void testAdminCreatesFacultyAndFacultyOnlySeesAssignedComplaints() throws Exception {
        String suffix = Long.toString(System.nanoTime());
        String facultyId = "FAC" + suffix;
        String facultyEmail = "faculty" + suffix + "@pariharam.demo";

        String adminLogin = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("ADMIN001", "admin123"))))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String adminToken = objectMapper.readTree(adminLogin).path("data").path("accessToken").asText();

        mockMvc.perform(post("/api/admin/faculty")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "facultyId", facultyId,
                                "name", "Integration Test Faculty",
                                "email", facultyEmail,
                                "password", "facultyPass123",
                                "department", "Electrical Maintenance"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.role").value("FACULTY"))
                .andExpect(jsonPath("$.data.department").value("Electrical Maintenance"));

        mockMvc.perform(post("/api/admin/complaints/comp-seed-101/assign")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "facultyId", facultyId,
                                "department", "Electrical Maintenance",
                                "dueDate", "2026-12-01"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.assignedFacultyId").value(facultyId));

        String facultyLogin = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest(facultyId, "facultyPass123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user.role").value("FACULTY"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        String facultyToken = objectMapper.readTree(facultyLogin).path("data").path("accessToken").asText();

        mockMvc.perform(get("/api/faculty/complaints")
                        .header("Authorization", "Bearer " + facultyToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].assignedFacultyId").value(facultyId))
                .andExpect(jsonPath("$.data[0].ticketId").value("CE-CEK-2026-000101"));

        String studentLogin = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("STU001", "student123"))))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String studentToken = objectMapper.readTree(studentLogin).path("data").path("accessToken").asText();

        mockMvc.perform(get("/api/faculty/complaints")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }
}
