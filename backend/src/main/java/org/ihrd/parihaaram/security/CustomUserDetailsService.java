package org.ihrd.parihaaram.security;

import org.ihrd.parihaaram.model.User;
import org.ihrd.parihaaram.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameIgnoreCase(identifier)
                .or(() -> userRepository.findByEmailIgnoreCase(identifier))
                .or(() -> userRepository.findByIdIgnoreCase(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + identifier));

        return new CustomUserDetails(user);
    }
}
