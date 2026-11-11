package org.ihrd.parihaaram.service;

import org.ihrd.parihaaram.dto.*;
import org.ihrd.parihaaram.exception.ResourceNotFoundException;
import org.ihrd.parihaaram.model.College;
import org.ihrd.parihaaram.model.Role;
import org.ihrd.parihaaram.model.Student;
import org.ihrd.parihaaram.model.User;
import org.ihrd.parihaaram.repository.CollegeRepository;
import org.ihrd.parihaaram.repository.StudentRepository;
import org.ihrd.parihaaram.repository.UserRepository;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.ihrd.parihaaram.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CollegeRepository collegeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;

    public AuthService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            CollegeRepository collegeRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.collegeRepository = collegeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        String identifier = request.getUsername().trim();

        User user = userRepository.findByUsernameIgnoreCase(identifier)
                .or(() -> userRepository.findByEmailIgnoreCase(identifier))
                .or(() -> userRepository.findByIdIgnoreCase(identifier))
                .orElseThrow(() -> {
                    auditLogService.log(identifier, "UNKNOWN", "LOGIN_FAILURE", "USER", identifier, ipAddress, "{\"reason\": \"User not found\"}");
                    return new BadCredentialsException("Invalid username or password.");
                });

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            auditLogService.log(user.getId(), user.getRole().name(), "LOGIN_FAILURE", "USER", user.getId(), ipAddress, "{\"reason\": \"Account deactivated\"}");
            throw new BadCredentialsException("Account is currently disabled. Please contact administration.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            auditLogService.log(user.getId(), user.getRole().name(), "LOGIN_FAILURE", "USER", user.getId(), ipAddress, "{\"reason\": \"Incorrect password\"}");
            throw new BadCredentialsException("Invalid username or password.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        auditLogService.log(user.getId(), user.getRole().name(), "LOGIN_SUCCESS", "USER", user.getId(), ipAddress, "{\"role\": \"" + user.getRole() + "\"}");

        UserDto userDto = toUserDto(user);
        return new AuthResponse(token, userDto);
    }

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest request) {
        String id = request.getStudentId().trim().toUpperCase();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByIdIgnoreCase(id) || userRepository.existsByUsernameIgnoreCase(id)) {
            throw new IllegalArgumentException("Student ID " + id + " is already registered.");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email " + email + " is already registered.");
        }

        String collegeCode = request.getCollegeCode().trim().toUpperCase().replace("#", "");
        if (!collegeRepository.existsByCodeIgnoreCase(collegeCode)) {
            collegeCode = "CEK"; // Safe institutional fallback
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                id,
                id,
                email,
                encodedPassword,
                request.getName().trim(),
                Role.STUDENT,
                collegeCode
        );
        userRepository.save(user);

        Student student = new Student(
                id,
                id,
                request.getDepartment() != null ? request.getDepartment() : "General",
                request.getYear() != null ? request.getYear() : 1
        );
        studentRepository.save(student);

        auditLogService.log(id, "STUDENT", "USER_REGISTERED", "USER", id, "127.0.0.1", "{\"college\": \"" + collegeCode + "\"}");

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        UserDto userDto = toUserDto(user);
        return new AuthResponse(token, userDto);
    }

    @Transactional
    public UserDto adminCreateStudent(AdminCreateStudentRequest request, String adminId, String adminCollegeCode) {
        String id = request.getStudentId().trim().toUpperCase();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByIdIgnoreCase(id) || userRepository.existsByUsernameIgnoreCase(id)) {
            throw new IllegalArgumentException("Student ID " + id + " already exists.");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email " + email + " already exists.");
        }

        String collegeCode = (request.getCollegeCode() != null && !request.getCollegeCode().isBlank())
                ? request.getCollegeCode().trim().toUpperCase().replace("#", "")
                : adminCollegeCode;

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                id,
                id,
                email,
                encodedPassword,
                request.getName().trim(),
                Role.STUDENT,
                collegeCode
        );
        userRepository.save(user);

        Student student = new Student(
                id,
                id,
                request.getDepartment() != null ? request.getDepartment() : "Engineering",
                request.getYear() != null ? request.getYear() : 1
        );
        studentRepository.save(student);

        auditLogService.log(adminId, "COLLEGE_ADMIN", "ADMIN_CREATED_STUDENT", "USER", id, "127.0.0.1", "{\"studentId\": \"" + id + "\"}");

        return toUserDto(user);
    }

    @Transactional
    public UserDto adminCreateFaculty(AdminCreateFacultyRequest request, CustomUserDetails admin) {
        String id = request.getFacultyId().trim().toUpperCase();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByIdIgnoreCase(id) || userRepository.existsByUsernameIgnoreCase(id)) {
            throw new IllegalArgumentException("Faculty ID " + id + " already exists.");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email " + email + " already exists.");
        }

        User faculty = new User(
                id,
                id,
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getName().trim(),
                Role.FACULTY,
                admin.getCollegeCode()
        );
        faculty.setDepartment(request.getDepartment().trim());
        userRepository.save(faculty);

        auditLogService.log(
                admin.getId(),
                admin.getRole().name(),
                "ADMIN_CREATED_FACULTY",
                "USER",
                id,
                "127.0.0.1",
                "{\"facultyId\": \"" + id + "\"}"
        );
        return toUserDto(faculty);
    }

    public List<UserDto> getCollegeFaculty(String collegeCode) {
        return userRepository.findByCollegeCodeAndRole(collegeCode, Role.FACULTY)
                .stream()
                .map(this::toUserDto)
                .toList();
    }

    public UserDto getCurrentUserProfile(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .or(() -> userRepository.findByIdIgnoreCase(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return toUserDto(user);
    }

    public UserDto toUserDto(User user) {
        UserDto dto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCollegeCode()
        );

        collegeRepository.findByCodeIgnoreCase(user.getCollegeCode()).ifPresent(c -> {
            dto.setCollegeName(c.getName());
        });

        if (user.getRole() == Role.STUDENT) {
            studentRepository.findById(user.getId()).ifPresent(s -> {
                dto.setDepartment(s.getDepartment());
                dto.setYear(s.getYearOfStudy());
            });
        } else if (user.getRole() == Role.FACULTY) {
            dto.setDepartment(user.getDepartment());
        }
        return dto;
    }
}
