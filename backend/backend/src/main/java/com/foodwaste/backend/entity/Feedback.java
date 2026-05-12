package com.foodwaste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private FoodDonation foodDonation;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comments", length = 1000)
    private String comments;

    public Feedback() {}

    public Long getFeedbackId() { return feedbackId; }
    public void setFeedbackId(Long feedbackId) { this.feedbackId = feedbackId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public FoodDonation getFoodDonation() { return foodDonation; }
    public void setFoodDonation(FoodDonation foodDonation) { this.foodDonation = foodDonation; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}