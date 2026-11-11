package org.ihrd.parihaaram.security;

import org.ihrd.parihaaram.model.Role;
import org.ihrd.parihaaram.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final String id;
    private final String username;
    private final String password;
    private final String name;
    private final String email;
    private final Role role;
    private final String collegeCode;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPasswordHash();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.collegeCode = user.getCollegeCode();
        this.active = Boolean.TRUE.equals(user.getIsActive());
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public String getCollegeCode() { return collegeCode; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return username; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return active; }
}
