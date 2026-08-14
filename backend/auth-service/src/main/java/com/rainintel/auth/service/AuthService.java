package com.rainintel.auth.service;

import com.rainintel.auth.dto.AuthResponse;
import com.rainintel.auth.dto.LoginRequest;
import com.rainintel.auth.dto.RegisterRequest;
import com.rainintel.auth.entity.Role;
import com.rainintel.auth.entity.User;
import com.rainintel.auth.repository.RoleRepository;
import com.rainintel.auth.repository.UserRepository;
import com.rainintel.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!"FIELD_ENGINEER".equals(request.getRoleName())) {
            throw new IllegalArgumentException("Registration is only permitted for FIELD_ENGINEER role");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + request.getRoleName()));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setDistrictId(request.getDistrictId());
        user.setStatus("ACTIVE");

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername(), role.getRoleName());
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getFullName(), role.getRoleName(), user.getDistrictId());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new IllegalStateException("User account is inactive");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().getRoleName());
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getFullName(), user.getRole().getRoleName(), user.getDistrictId());
    }
}
