package org.ihrd.parihaaram.service;

import org.ihrd.parihaaram.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class EvidenceStorageService {

    private final Path storageLocation;
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf"
    );

    public EvidenceStorageService(@Value("${app.storage.upload-dir:uploads/evidence}") String uploadDir) {
        this.storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException ex) {
            throw new FileStorageException("Could not create directory for evidence storage.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileStorageException("Cannot store an empty file.");
        }
        if (file.getSize() > 10L * 1024 * 1024) {
            throw new FileStorageException("Evidence files must be 10MB or smaller.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new FileStorageException("Invalid file type: " + contentType + ". Allowed: JPG, PNG, WEBP, PDF.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        // Generate safe unique filename
        String storedFilename = UUID.randomUUID() + extension;

        try {
            Path targetLocation = this.storageLocation.resolve(storedFilename).normalize();
            if (!targetLocation.startsWith(this.storageLocation)) {
                throw new FileStorageException("Invalid storage path attempt.");
            }
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException ex) {
            throw new FileStorageException("Failed to store file: " + storedFilename, ex);
        }
    }

    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = this.storageLocation.resolve(filename).normalize();
            if (!filePath.startsWith(this.storageLocation) || filename.contains("/") || filename.contains("\\")) {
                throw new FileStorageException("Invalid evidence filename.");
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("File not found: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new FileStorageException("File not found: " + filename, ex);
        }
    }
}
