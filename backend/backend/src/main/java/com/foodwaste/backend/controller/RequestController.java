package com.foodwaste.backend.controller;

import com.foodwaste.backend.entity.FoodDonation;
import com.foodwaste.backend.entity.Request;
import com.foodwaste.backend.entity.User;
import com.foodwaste.backend.repository.FoodDonationRepository;
import com.foodwaste.backend.repository.RequestRepository;
import com.foodwaste.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodDonationRepository foodDonationRepository;

    // POST /requests
    // Body: { "donationId":1, "userId":2, "requestDate":"2025-06-01", "status":"PENDING" }
    @PostMapping
    public ResponseEntity<Object> createRequest(@RequestBody Map<String, Object> body) {
        Long donationId = Long.valueOf(body.get("donationId").toString());
        Optional<FoodDonation> donationOpt = foodDonationRepository.findById(donationId);
        if (!donationOpt.isPresent())
            return new ResponseEntity<>("Donation not found with id: " + donationId, HttpStatus.NOT_FOUND);

        Long userId = Long.valueOf(body.get("userId").toString());
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent())
            return new ResponseEntity<>("User not found with id: " + userId, HttpStatus.NOT_FOUND);

        Request request = new Request();
        request.setFoodDonation(donationOpt.get());
        request.setUser(userOpt.get());
        request.setStatus(body.get("status") != null ? body.get("status").toString() : "PENDING");
        request.setRequestDate(body.get("requestDate") != null
                ? LocalDate.parse(body.get("requestDate").toString()) : LocalDate.now());

        return new ResponseEntity<>(requestRepository.save(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Request>> getAllRequests() {
        return new ResponseEntity<>(requestRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getRequestById(@PathVariable Long id) {
        Optional<Request> opt = requestRepository.findById(id);
        if (opt.isPresent()) return new ResponseEntity<>(opt.get(), HttpStatus.OK);
        return new ResponseEntity<>("Request not found with id: " + id, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateRequest(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Request> opt = requestRepository.findById(id);
        if (!opt.isPresent())
            return new ResponseEntity<>("Request not found with id: " + id, HttpStatus.NOT_FOUND);

        Request existing = opt.get();
        if (body.get("donationId") != null) {
            Long donationId = Long.valueOf(body.get("donationId").toString());
            Optional<FoodDonation> donOpt = foodDonationRepository.findById(donationId);
            if (!donOpt.isPresent())
                return new ResponseEntity<>("Donation not found with id: " + donationId, HttpStatus.NOT_FOUND);
            existing.setFoodDonation(donOpt.get());
        }
        if (body.get("userId") != null) {
            Long userId = Long.valueOf(body.get("userId").toString());
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent())
                return new ResponseEntity<>("User not found with id: " + userId, HttpStatus.NOT_FOUND);
            existing.setUser(userOpt.get());
        }
        if (body.get("status") != null) existing.setStatus(body.get("status").toString());
        if (body.get("requestDate") != null)
            existing.setRequestDate(LocalDate.parse(body.get("requestDate").toString()));

        return new ResponseEntity<>(requestRepository.save(existing), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRequest(@PathVariable Long id) {
        if (!requestRepository.existsById(id))
            return new ResponseEntity<>("Request not found with id: " + id, HttpStatus.NOT_FOUND);
        requestRepository.deleteById(id);
        return new ResponseEntity<>("Request deleted successfully!", HttpStatus.OK);
    }
}