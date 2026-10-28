
package com.paymentdispute.payment_dispute_api.controller;

import com.paymentdispute.payment_dispute_api.model.AppUser;
import com.paymentdispute.payment_dispute_api.model.Dispute;
import com.paymentdispute.payment_dispute_api.repository.AppUserRepository;
import com.paymentdispute.payment_dispute_api.repository.DisputeRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    private final DisputeRepository disputeRepository;
    private final AppUserRepository appUserRepository;

    public DisputeController(
            DisputeRepository disputeRepository,
            AppUserRepository appUserRepository) {
        this.disputeRepository = disputeRepository;
        this.appUserRepository = appUserRepository;
    }

    private AppUser getCurrentUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        Long userId = jwt.getClaim("userId");

        return appUserRepository.findById(userId)
                .orElseThrow(() ->
                        new org.springframework.security.access.AccessDeniedException(
                                "User account not found"));
    }

    @PostMapping
    public ResponseEntity<?> createDispute(
            @Valid @RequestBody Dispute dispute,
            Authentication authentication) {

        AppUser currentUser = getCurrentUser(authentication);

        // Never accept ownership supplied by the frontend.
        dispute.setOwner(currentUser);

        // New disputes must start as OPEN.
        dispute.setStatus("OPEN");

        Dispute savedDispute = disputeRepository.save(dispute);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDispute);
    }

    @GetMapping
    public List<Dispute> getAllDisputes(
            Authentication authentication) {

        if (authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"))) {
            return disputeRepository.findAll();
        }

        AppUser currentUser = getCurrentUser(authentication);

        return disputeRepository.findByOwner_Id(currentUser.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispute> getDisputeById(
            @PathVariable Long id,
            Authentication authentication) {

        if (authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"))) {
            return disputeRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        AppUser currentUser = getCurrentUser(authentication);

        return disputeRepository
                .findByIdAndOwner_Id(id, currentUser.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDisputeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String newStatus = request.get("status");

        if (newStatus == null ||
                (!newStatus.equals("OPEN") &&
                 !newStatus.equals("RESOLVED"))) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Status must be OPEN or RESOLVED"));
        }

        return disputeRepository.findById(id)
                .map(dispute -> {
                    dispute.setStatus(newStatus);
                    Dispute updated = disputeRepository.save(dispute);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
