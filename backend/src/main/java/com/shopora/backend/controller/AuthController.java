package com.shopora.backend.controller;

import com.shopora.backend.model.User;
import com.shopora.backend.repository.UserRepository;
import com.shopora.backend.security.JwtService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    public record AuthRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email, @NotBlank String password) {}
    public record AuthResponse(String token, String name, String email, String role) {}

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req) {
        if (users.findByEmail(req.email()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        User u = new User();
        u.setName(req.name()); u.setEmail(req.email()); u.setPassword(encoder.encode(req.password())); u.setRole("USER");
        users.save(u);
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole()), u.getName(), u.getEmail(), u.getRole());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        User u = users.findByEmail(req.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!encoder.matches(req.password(), u.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole()), u.getName(), u.getEmail(), u.getRole());
    }
}
