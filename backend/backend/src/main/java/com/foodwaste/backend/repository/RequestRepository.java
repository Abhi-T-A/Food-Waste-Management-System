package com.foodwaste.backend.repository;

import com.foodwaste.backend.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByUserUserId(Long userId);
    List<Request> findByFoodDonationDonationId(Long donationId);
    List<Request> findByStatus(String status);
}