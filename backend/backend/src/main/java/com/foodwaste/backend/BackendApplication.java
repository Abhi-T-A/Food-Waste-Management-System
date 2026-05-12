package com.foodwaste.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("Food Waste Management System is running!");
        System.out.println("API Base URL : http://localhost:8080");
    }
}