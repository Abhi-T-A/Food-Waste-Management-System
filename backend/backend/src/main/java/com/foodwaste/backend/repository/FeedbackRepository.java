package com.foodwaste.backend.repository;

import com.foodwaste.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUserUserId(Long userId);
    List<Feedback> findByFoodDonationDonationId(Long donationId);
}