package com.foodwaste.backend.repository;

import com.foodwaste.backend.entity.FoodDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {
    List<FoodDonation> findByUserUserId(Long userId);
    List<FoodDonation> findByStatus(String status);
}