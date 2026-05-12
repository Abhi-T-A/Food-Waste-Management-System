package com.foodwaste.backend.controller;

import com.foodwaste.backend.entity.Distribution;
import com.foodwaste.backend.entity.FoodDonation;
import com.foodwaste.backend.entity.User;
import com.foodwaste.backend.repository.DistributionRepository;
import com.foodwaste.backend.repository.FoodDonationRepository;
import com.foodwaste.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/distributions")
public class DistributionController {

    @Autowired
    private DistributionRepository distributionRepository;

    @Autowired
    private FoodDonationRepository foodDonationRepository;

    @Autowired
    private UserRepository userRepository;

    // POST /distributions
    // Body: { "donationId":1, "volunteerId":2, "deliveryStatus":"PENDING" }
    @PostMapping
    public ResponseEntity<Object> createDistribution(@RequestBody Map<String, Object> body) {
        Long donationId = Long.valueOf(body.get("donationId").toString());
        Optional<FoodDonation> donationOpt = foodDonationRepository.findById(donationId);
        if (!donationOpt.isPresent())
            return new ResponseEntity<>("Donation not found with id: " + donationId, HttpStatus.NOT_FOUND);

        Long volunteerId = Long.valueOf(body.get("volunteerId").toString());
        Optional<User> volunteerOpt = userRepository.findById(volunteerId);
        if (!volunteerOpt.isPresent())
            return new ResponseEntity<>("Volunteer not found with id: " + volunteerId, HttpStatus.NOT_FOUND);

        Distribution distribution = new Distribution();
        distribution.setFoodDonation(donationOpt.get());
        distribution.setVolunteer(volunteerOpt.get());
        distribution.setDeliveryStatus(body.get("deliveryStatus") != null
                ? body.get("deliveryStatus").toString() : "PENDING");

        return new ResponseEntity<>(distributionRepository.save(distribution), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Distribution>> getAllDistributions() {
        return new ResponseEntity<>(distributionRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDistributionById(@PathVariable Long id) {
        Optional<Distribution> opt = distributionRepository.findById(id);
        if (opt.isPresent()) return new ResponseEntity<>(opt.get(), HttpStatus.OK);
        return new ResponseEntity<>("Distribution not found with id: " + id, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateDistribution(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Distribution> opt = distributionRepository.findById(id);
        if (!opt.isPresent())
            return new ResponseEntity<>("Distribution not found with id: " + id, HttpStatus.NOT_FOUND);

        Distribution existing = opt.get();
        if (body.get("donationId") != null) {
            Long donationId = Long.valueOf(body.get("donationId").toString());
            Optional<FoodDonation> donOpt = foodDonationRepository.findById(donationId);
            if (!donOpt.isPresent())
                return new ResponseEntity<>("Donation not found with id: " + donationId, HttpStatus.NOT_FOUND);
            existing.setFoodDonation(donOpt.get());
        }
        if (body.get("volunteerId") != null) {
            Long volunteerId = Long.valueOf(body.get("volunteerId").toString());
            Optional<User> volOpt = userRepository.findById(volunteerId);
            if (!volOpt.isPresent())
                return new ResponseEntity<>("Volunteer not found with id: " + volunteerId, HttpStatus.NOT_FOUND);
            existing.setVolunteer(volOpt.get());
        }
        if (body.get("deliveryStatus") != null)
            existing.setDeliveryStatus(body.get("deliveryStatus").toString());

        return new ResponseEntity<>(distributionRepository.save(existing), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDistribution(@PathVariable Long id) {
        if (!distributionRepository.existsById(id))
            return new ResponseEntity<>("Distribution not found with id: " + id, HttpStatus.NOT_FOUND);
        distributionRepository.deleteById(id);
        return new ResponseEntity<>("Distribution deleted successfully!", HttpStatus.OK);
    }
}