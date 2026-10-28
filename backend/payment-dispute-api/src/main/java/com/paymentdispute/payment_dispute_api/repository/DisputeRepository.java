
package com.paymentdispute.payment_dispute_api.repository;

import com.paymentdispute.payment_dispute_api.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    List<Dispute> findByOwner_Id(Long ownerId);

    Optional<Dispute> findByIdAndOwner_Id(Long id, Long ownerId);
}
