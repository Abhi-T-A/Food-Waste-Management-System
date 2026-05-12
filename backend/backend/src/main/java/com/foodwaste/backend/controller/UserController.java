package com.foodwaste.backend.controller;

import com.foodwaste.backend.entity.User;
import com.foodwaste.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userRepository.save(user);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) return new ResponseEntity<>(user.get(), HttpStatus.OK);
        return new ResponseEntity<>("User not found with id: " + id, HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> optional = userRepository.findById(id);
        if (!optional.isPresent())
            return new ResponseEntity<>("User not found with id: " + id, HttpStatus.NOT_FOUND);

        User existing = optional.get();
        existing.setName(updatedUser.getName());
        existing.setPhone(updatedUser.getPhone());
        existing.setEmail(updatedUser.getEmail());
        existing.setAddress(updatedUser.getAddress());
        return new ResponseEntity<>(userRepository.save(existing), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id))
            return new ResponseEntity<>("User not found with id: " + id, HttpStatus.NOT_FOUND);

        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>("User deleted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "Cannot delete! This user has linked Donations/Requests/Feedback. " +
                            "Delete those first, then try again.",
                    HttpStatus.CONFLICT   // 409 instead of 500
            );
        }
    }
}