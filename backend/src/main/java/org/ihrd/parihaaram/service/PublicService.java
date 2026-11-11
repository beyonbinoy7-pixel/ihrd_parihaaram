package org.ihrd.parihaaram.service;

import org.ihrd.parihaaram.model.College;
import org.ihrd.parihaaram.model.ComplaintStatus;
import org.ihrd.parihaaram.repository.CollegeRepository;
import org.ihrd.parihaaram.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PublicService {

    private final CollegeRepository collegeRepository;
    private final ComplaintRepository complaintRepository;

    public PublicService(CollegeRepository collegeRepository, ComplaintRepository complaintRepository) {
        this.collegeRepository = collegeRepository;
        this.complaintRepository = complaintRepository;
    }

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public Optional<College> getCollegeByCodeOrId(String identifier) {
        String clean = identifier.trim().replaceAll("^#+", "");
        return collegeRepository.findByCodeIgnoreCase(clean)
                .or(() -> collegeRepository.findById(clean.toLowerCase()))
                .or(() -> collegeRepository.findByHashtagIgnoreCase("#" + clean));
    }

    public List<Map<String, Object>> getCategories() {
        return Arrays.asList(
                createCategory("infrastructure", "Infrastructure & Civil", "Classroom, Labs, Desks, Doors, Structural", "Building2"),
                createCategory("electrical", "Electrical & Lighting", "Fans, Lights, Switchboards, Projector, UPS", "Zap"),
                createCategory("water", "Water & Plumbing", "Drinking Water, Restrooms, Leakage, Drainage", "Droplets"),
                createCategory("wifi", "Network, Wi-Fi & IT", "Campus Wi-Fi, Ethernet Ports, Lab Internet, Servers", "Wifi"),
                createCategory("cleanliness", "Cleanliness & Sanitation", "Corridors, Restroom Hygiene, Waste Disposal", "Sparkles"),
                createCategory("canteen", "Canteen & Food Quality", "Hygiene, Food Quality, Drinking Water, Pricing", "Utensils"),
                createCategory("library", "Library & Resources", "Book Availability, Reading Room, AC, Computers", "BookOpen"),
                createCategory("other", "General / Other", "Campus Safety, Security, Transportation, Administrative", "HelpCircle")
        );
    }

    public Map<String, Object> getOverallStats() {
        long totalComplaints = complaintRepository.count();
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED) + complaintRepository.countByStatus(ComplaintStatus.CLOSED);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long submitted = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED) + complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW);

        double rate = totalComplaints > 0 ? (resolved * 100.0 / totalComplaints) : 92.5;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalColleges", collegeRepository.count());
        stats.put("totalComplaints", totalComplaints);
        stats.put("resolvedComplaints", resolved);
        stats.put("inProgressComplaints", inProgress);
        stats.put("pendingComplaints", submitted);
        stats.put("resolutionRate", Math.round(rate * 10.0) / 10.0);
        stats.put("avgResolutionHours", 18.5);
        return stats;
    }

    public List<Map<String, Object>> getLeaderboard() {
        List<College> colleges = collegeRepository.findAll();
        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (College c : colleges) {
            long total = complaintRepository.countByTargetCollegeCode(c.getCode());
            long resolved = complaintRepository.countByTargetCollegeCodeAndStatus(c.getCode(), ComplaintStatus.RESOLVED)
                    + complaintRepository.countByTargetCollegeCodeAndStatus(c.getCode(), ComplaintStatus.CLOSED);

            double rate = total > 0 ? (resolved * 100.0 / total) : (c.getPerformanceScore() != null ? c.getPerformanceScore() : 85.0);

            Map<String, Object> entry = new HashMap<>();
            entry.put("id", c.getId());
            entry.put("code", c.getCode());
            entry.put("name", c.getName());
            entry.put("hashtag", c.getHashtag());
            entry.put("location", c.getLocation());
            entry.put("district", c.getDistrict());
            entry.put("totalComplaints", total);
            entry.put("resolvedComplaints", resolved);
            entry.put("performanceScore", Math.round(rate * 10.0) / 10.0);
            entry.put("currentRank", c.getCurrentRank());
            leaderboard.add(entry);
        }

        // Sort by performance score descending
        leaderboard.sort((a, b) -> Double.compare((Double) b.get("performanceScore"), (Double) a.get("performanceScore")));

        // Assign ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).put("currentRank", i + 1);
        }

        return leaderboard;
    }

    private Map<String, Object> createCategory(String id, String name, String desc, String icon) {
        Map<String, Object> cat = new HashMap<>();
        cat.put("id", id);
        cat.put("name", name);
        cat.put("description", desc);
        cat.put("icon", icon);
        return cat;
    }
}
