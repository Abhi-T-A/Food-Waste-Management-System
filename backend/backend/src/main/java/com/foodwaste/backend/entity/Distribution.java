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
@Table(name = "distribution")
public class Distribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "distribution_id")
    private Long distributionId;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private FoodDonation foodDonation;

    @ManyToOne
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @Column(name = "delivery_status")
    private String deliveryStatus;

    public Distribution() {}

    public Long getDistributionId() { return distributionId; }
    public void setDistributionId(Long distributionId) { this.distributionId = distributionId; }

    public FoodDonation getFoodDonation() { return foodDonation; }
    public void setFoodDonation(FoodDonation foodDonation) { this.foodDonation = foodDonation; }

    public User getVolunteer() { return volunteer; }
    public void setVolunteer(User volunteer) { this.volunteer = volunteer; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }
}