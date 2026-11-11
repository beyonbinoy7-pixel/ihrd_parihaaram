package org.ihrd.parihaaram.repository;

import org.ihrd.parihaaram.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, String> {
    Optional<College> findByCodeIgnoreCase(String code);
    Optional<College> findByHashtagIgnoreCase(String hashtag);
    boolean existsByCodeIgnoreCase(String code);
}
