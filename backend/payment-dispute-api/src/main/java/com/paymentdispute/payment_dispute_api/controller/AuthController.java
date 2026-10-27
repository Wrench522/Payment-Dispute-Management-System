
package com.paymentdispute.payment_dispute_api.controller;

import com.paymentdispute.payment_dispute_api.service.AuthService;
import com.paymentdispute.payment_dispute_api.service.AuthService.LoginResult;
import com.paymentdispute.payment_dispute_api.model.AppUser;
import com.paymentdispute.payment_dispute_api.repository.AppUserRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthService authService,
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record RegisterRequest(
            @NotBlank @Size(max = 100) String fullName,
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 72) String password
    ) {}

    public record LoginResponse(
            String token,
            Long id,
            String fullName,
            String email,
            String role
    ) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        String email = request.email().trim().toLowerCase();

        if (appUserRepository.findByEmailIgnoreCase(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "An account with this email already exists"));
        }

       AppUser user = new AppUser(
        request.fullName(),
        request.email(),
        passwordEncoder.encode(request.password()),
        "USER"
);

        AppUser savedUser = appUserRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Account created successfully",
                "id", savedUser.getId(),
                "fullName", savedUser.getFullName(),
                "email", savedUser.getEmail(),
                "role", savedUser.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResult result = authService.authenticate(
                request.email(),
                request.password()
        );

        return ResponseEntity.ok(new LoginResponse(
                result.token(),
                result.id(),
                result.fullName(),
                result.email(),
                result.role()
        ));
    }
}
