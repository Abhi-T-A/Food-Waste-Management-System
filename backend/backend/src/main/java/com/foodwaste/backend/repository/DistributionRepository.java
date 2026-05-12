package com.foodwaste.backend.repository;

import com.foodwaste.backend.entity.Distribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DistributionRepository extends JpaRepository<Distribution, Long> {
    List<Distribution> findByVolunteerUserId(Long volunteerId);
    List<Distribution> findByFoodDonationDonationId(Long donationId);
    List<Distribution> findByDeliveryStatus(String deliveryStatus);
}