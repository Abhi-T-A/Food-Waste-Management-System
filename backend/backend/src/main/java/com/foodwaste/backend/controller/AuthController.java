package com.foodwaste.backend.controller;

import com.foodwaste.backend.entity.User;
import com.foodwaste.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email already exists");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {

        Optional<User> userOptional =
                userRepository.findByEmail(loginData.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        User user = userOptional.get();

        if (!user.getPassword()
                .equals(loginData.getPassword())) {

            return ResponseEntity.badRequest()
                    .body("Invalid password");
        }

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}