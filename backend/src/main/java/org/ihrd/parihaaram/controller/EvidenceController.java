package org.ihrd.parihaaram.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ihrd.parihaaram.dto.ApiResponse;
import org.ihrd.parihaaram.service.EvidenceStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/evidence")
@Tag(name = "Evidence Management", description = "Multipart upload and retrieval of before/after photos and documents")
public class EvidenceController {

    private final EvidenceStorageService storageService;

    public EvidenceController(EvidenceStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload photographic or documentary evidence file (max 10MB)")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String storedFilename = storageService.storeFile(file);
        String fileUrl = "/api/evidence/" + storedFilename;

        Map<String, String> responseData = new HashMap<>();
        responseData.put("fileName", storedFilename);
        responseData.put("url", fileUrl);

        return ResponseEntity.ok(ApiResponse.success(responseData, "Evidence uploaded successfully"));
    }

    @GetMapping("/{filename:.+}")
    @Operation(summary = "Retrieve stored evidence file by filename")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource resource = storageService.loadFileAsResource(filename);
        String contentType = "application/octet-stream";
        try {
            contentType = Files.probeContentType(resource.getFile().toPath());
        } catch (IOException ex) {
            // Default to octet-stream if detection fails
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : "image/jpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
