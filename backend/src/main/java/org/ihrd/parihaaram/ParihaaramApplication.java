package org.ihrd.parihaaram;

import org.ihrd.parihaaram.model.Role;
import org.ihrd.parihaaram.model.User;
import org.ihrd.parihaaram.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ParihaaramApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParihaaramApplication.class, args);
    }

    @Bean
    public CommandLineRunner verifySeedPasswords(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Ensure seeded accounts have verified BCrypt hashes
            userRepository.findById("STU001").ifPresent(u -> {
                if (!passwordEncoder.matches("student123", u.getPasswordHash())) {
                    u.setPasswordHash(passwordEncoder.encode("student123"));
                    userRepository.save(u);
                }
            });

            userRepository.findById("ADMIN001").ifPresent(u -> {
                if (!passwordEncoder.matches("admin123", u.getPasswordHash())) {
                    u.setPasswordHash(passwordEncoder.encode("admin123"));
                    userRepository.save(u);
                }
            });

            userRepository.findById("ADMIN002").ifPresent(u -> {
                if (!passwordEncoder.matches("admin123", u.getPasswordHash())) {
                    u.setPasswordHash(passwordEncoder.encode("admin123"));
                    userRepository.save(u);
                }
            });

            userRepository.findById("SUPER001").ifPresent(u -> {
                if (!passwordEncoder.matches("admin123", u.getPasswordHash())) {
                    u.setPasswordHash(passwordEncoder.encode("admin123"));
                    userRepository.save(u);
                }
            });

            System.out.println("🏛️ PARIHAARAM Backend System initialized with active PostgreSQL/H2 database and verified BCrypt accounts.");
        };
    }
}
