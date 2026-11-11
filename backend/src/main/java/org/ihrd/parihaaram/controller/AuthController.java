package org.ihrd.parihaaram.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.ihrd.parihaaram.dto.*;
import org.ihrd.parihaaram.security.CustomUserDetails;
import org.ihrd.parihaaram.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for login, student registration, and user identity")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        AuthResponse response = authService.login(request, ip);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new student account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterStudentRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Registration successful"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user details")
    public ResponseEntity<ApiResponse<UserDto>> me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated", "UNAUTHORIZED"));
        }
        UserDto dto = authService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user (client should clear token)")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }
}
