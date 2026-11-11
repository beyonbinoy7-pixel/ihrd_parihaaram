package org.ihrd.parihaaram.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "colleges")
public class College {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String hashtag;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, length = 100)
    private String district;

    private Double lat;
    private Double lng;

    @Column(length = 150)
    private String principal;

    @Column(length = 50)
    private String phone;

    @Column(length = 150)
    private String email;

    private Integer establishedYear;

    @Column(nullable = false)
    private Boolean isActive = true;

    private Integer currentRank = 1;
    private Double performanceScore = 85.0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public College() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHashtag() { return hashtag; }
    public void setHashtag(String hashtag) { this.hashtag = hashtag; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public String getPrincipal() { return principal; }
    public void setPrincipal(String principal) { this.principal = principal; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getEstablishedYear() { return establishedYear; }
    public void setEstablishedYear(Integer establishedYear) { this.establishedYear = establishedYear; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public Integer getCurrentRank() { return currentRank; }
    public void setCurrentRank(Integer currentRank) { this.currentRank = currentRank; }

    public Double getPerformanceScore() { return performanceScore; }
    public void setPerformanceScore(Double performanceScore) { this.performanceScore = performanceScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
