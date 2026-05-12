package com.foodwaste.backend.controller;

import com.foodwaste.backend.entity.Feedback;
import com.foodwaste.backend.entity.FoodDonation;
import com.foodwaste.backend.entity.User;
import com.foodwaste.backend.repository.FeedbackRepository;
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
@RequestMapping("/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodDonationRepository foodDonationRepository;

    // POST /feedbacks
    // Body: { "userId":2, "donationId":1, "rating":5, "comments":"Great!" }
    @PostMapping
    public ResponseEntity<Object> createFeedback(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent())
            return new ResponseEntity<>("User not found with id: " + userId, HttpStatus.NOT_FOUND);

        Long donationId = Long.valueOf(body.get("donationId").toString());
        Optional<FoodDonation> donationOpt = foodDonationRepository.findById(donationId);
        if (!donationOpt.isPresent())
            return new ResponseEntity<>("Donation not found with id: " + donationId, HttpStatus.NOT_FOUND);

        Feedback feedback = new Feedback();
        feedback.setUser(userOpt.get());
        feedback.setFoodDonation(donationOpt.get());
        if (body.get("rating") != null) feedback.setRating(Integer.valueOf(body.get("rating").toString()));
        if (body.get("comments") != null) feedback.setComments(body.get("comments").toString());

        return new ResponseEntity<>(feedbackRepository.save(feedback), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        return new ResponseEntity<>(feedbackRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getFeedbackById(@PathVariable Long id) {
        Optional<Feedback> opt = feedbackRepository.findById(id);
        if (opt.isPresent()) return new ResponseEntity<>(opt.get(), HttpStatus.OK);
        return new ResponseEntity<>("Feedback not found with id: " + id, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateFeedback(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Feedback> opt = feedbackRepository.findById(id);
        if (!opt.isPresent())
            return new ResponseEntity<>("Feedback not found with id: " + id, HttpStatus.NOT_FOUND);

        Feedback existing = opt.get();
        if (body.get("userId") != null) {
            Long userId = Long.valueOf(body.get("userId").toString());
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent())
                return new ResponseEntity<>("User not found with id: " + userId, HttpStatus.NOT_FOUND);
            existing.setUser(userOpt.get());
        }
        if (body.get("donationId") != null) {
            Long donationId = Long.valueOf(body.get("donationId").toString());
            Optional<FoodDonation> donOpt = foodDonationRepository.findById(donationId);
            if (!donOpt.isPresent())
                return new ResponseEntity<>("Donation not found with id: " + donationId, HttpStatus.NOT_FOUND);
            existing.setFoodDonation(donOpt.get());
        }
        if (body.get("rating") != null) existing.setRating(Integer.valueOf(body.get("rating").toString()));
        if (body.get("comments") != null) existing.setComments(body.get("comments").toString());

        return new ResponseEntity<>(feedbackRepository.save(existing), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id) {
        if (!feedbackRepository.existsById(id))
            return new ResponseEntity<>("Feedback not found with id: " + id, HttpStatus.NOT_FOUND);
        feedbackRepository.deleteById(id);
        return new ResponseEntity<>("Feedback deleted successfully!", HttpStatus.OK);
    }
}