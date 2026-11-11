package org.ihrd.parihaaram.repository;

import org.ihrd.parihaaram.model.Role;
import org.ihrd.parihaaram.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsernameIgnoreCase(String username);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByIdIgnoreCase(String id);
    List<User> findByCollegeCodeAndRole(String collegeCode, Role role);
    List<User> findByRole(Role role);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByIdIgnoreCase(String id);
}
