
package com.paymentdispute.payment_dispute_api.repository;

import com.paymentdispute.payment_dispute_api.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
}
