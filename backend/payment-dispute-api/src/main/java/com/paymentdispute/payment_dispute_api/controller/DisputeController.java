
package com.paymentdispute.payment_dispute_api.controller;

import com.paymentdispute.payment_dispute_api.model.Dispute;
import com.paymentdispute.payment_dispute_api.repository.DisputeRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://payment-dispute-management-system.vercel.app"
})
public class DisputeController {

    private final DisputeRepository disputeRepository;

    public DisputeController(DisputeRepository disputeRepository) {
        this.disputeRepository = disputeRepository;
    }

    @PostMapping
    public ResponseEntity<Dispute> createDispute(
            @Valid @RequestBody Dispute dispute) {

        Dispute savedDispute = disputeRepository.save(dispute);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDispute);
    }

    @GetMapping
    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispute> getDisputeById(
            @PathVariable Long id) {

        return disputeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
