package org.ihrd.parihaaram.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ihrd.parihaaram.dto.ApiResponse;
import org.ihrd.parihaaram.exception.ResourceNotFoundException;
import org.ihrd.parihaaram.model.College;
import org.ihrd.parihaaram.service.PublicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Public Directory", description = "Public endpoints for colleges, categories, and institutional statistics")
public class PublicController {

    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

    @GetMapping("/colleges")
    @Operation(summary = "Get list of all participating IHRD colleges")
    public ResponseEntity<ApiResponse<List<College>>> getColleges() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getAllColleges()));
    }

    @GetMapping("/colleges/{idOrCode}")
    @Operation(summary = "Get details of a specific college by code or id")
    public ResponseEntity<ApiResponse<College>> getCollege(@PathVariable String idOrCode) {
        College college = publicService.getCollegeByCodeOrId(idOrCode)
                .orElseThrow(() -> new ResourceNotFoundException("College not found: " + idOrCode));
        return ResponseEntity.ok(ApiResponse.success(college));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get complaint categories and service domains")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getCategories()));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get overall grievance redressal statistics across IHRD")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getOverallStats()));
    }

    @GetMapping("/leaderboard")
    @Operation(summary = "Get live weekly college performance leaderboard")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getLeaderboard() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getLeaderboard()));
    }
}
