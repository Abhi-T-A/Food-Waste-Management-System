package com.foodwaste.backend.controller;

import com.foodwaste.backend.entity.FoodDonation;
import com.foodwaste.backend.entity.User;
import com.foodwaste.backend.repository.FoodDonationRepository;
import com.foodwaste.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/donations")
public class FoodDonationController {

    @Autowired
    private FoodDonationRepository foodDonationRepository;

    @Autowired
    private UserRepository userRepository;

    // POST /donations
    // Body: { "userId":1, "foodName":"Rice", "quantity":10, "expiryTime":"2025-12-31T18:00:00", "status":"AVAILABLE" }
    @PostMapping
    public ResponseEntity<Object> createDonation(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent())
            return new ResponseEntity<>("User not found with id: " + userId, HttpStatus.NOT_FOUND);

        FoodDonation donation = new FoodDonation();
        donation.setUser(userOpt.get());
        donation.setFoodName(body.get("foodName").toString());
        donation.setQuantity(Integer.valueOf(body.get("quantity").toString()));
        donation.setStatus(body.get("status") != null ? body.get("status").toString() : "AVAILABLE");
        if (body.get("expiryTime") != null)
            donation.setExpiryTime(LocalDateTime.parse(body.get("expiryTime").toString()));

        return new ResponseEntity<>(foodDonationRepository.save(donation), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FoodDonation>> getAllDonations() {
        return new ResponseEntity<>(foodDonationRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDonationById(@PathVariable Long id) {
        Optional<FoodDonation> opt = foodDonationRepository.findById(id);
        if (opt.isPresent()) return new ResponseEntity<>(opt.get(), HttpStatus.OK);
        return new ResponseEntity<>("Donation not found with id: " + id, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateDonation(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<FoodDonation> opt = foodDonationRepository.findById(id);
        if (!opt.isPresent())
            return new ResponseEntity<>("Donation not found with id: " + id, HttpStatus.NOT_FOUND);

        FoodDonation existing = opt.get();
        if (body.get("userId") != null) {
            Long userId = Long.valueOf(body.get("userId").toString());
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent())
                return new ResponseEntity<>("User not found with id: " + userId, HttpStatus.NOT_FOUND);
            existing.setUser(userOpt.get());
        }
        if (body.get("foodName") != null) existing.setFoodName(body.get("foodName").toString());
        if (body.get("quantity") != null) existing.setQuantity(Integer.valueOf(body.get("quantity").toString()));
        if (body.get("status") != null) existing.setStatus(body.get("status").toString());
        if (body.get("expiryTime") != null)
            existing.setExpiryTime(LocalDateTime.parse(body.get("expiryTime").toString()));

        return new ResponseEntity<>(foodDonationRepository.save(existing), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDonation(@PathVariable Long id) {
        if (!foodDonationRepository.existsById(id))
            return new ResponseEntity<>("Donation not found with id: " + id, HttpStatus.NOT_FOUND);

        try {
            foodDonationRepository.deleteById(id);
            return new ResponseEntity<>("Donation deleted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Cannot delete! This donation has linked Requests/Distributions/Feedback. " +
                            "Delete those first, then try again.",
                    HttpStatus.CONFLICT
            );
        }
    }
}