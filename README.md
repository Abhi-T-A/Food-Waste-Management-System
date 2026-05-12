# 🍱 Food Waste Management System

A full-stack web application developed to reduce food wastage by connecting food donors, volunteers, and needy users through a centralized platform.

---

# 🚀 Project Overview

The Food Waste Management System helps manage:

* Food Donations
* Food Requests
* Distribution Tracking
* User Management
* Feedback Collection

This system aims to reduce food wastage and improve food distribution efficiency.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* Lucide React Icons

## Backend

* Spring Boot
* Spring Data JPA
* REST APIs
* Maven

## Database

* PostgreSQL

## Testing Tools

* Postman
* Swagger UI

---

# ✨ Features

## 👤 User Management

* User Registration
* Login System
* Role-based Users

  * Admin
  * Donor
  * Volunteer

## 🍲 Food Donation Module

* Add Donations
* Update Donation Details
* Track Food Status

## 📦 Request Management

* Create Food Requests
* Approve / Reject Requests
* Request Status Tracking

## 🚚 Distribution Module

* Assign Volunteers
* Track Delivery Status
* Distribution Management

## ⭐ Feedback Module

* Submit Feedback
* Rating System

## 📊 Dashboard

* Total Users
* Total Donations
* Total Requests
* Total Distributions
* Total Feedback
* Analytics Cards

---

# 🧱 System Architecture

```text
React Frontend
       ↓
Axios API Calls
       ↓
Spring Boot REST API
       ↓
Service Layer
       ↓
Repository Layer
       ↓
PostgreSQL Database
```

---

# 🔗 REST API Endpoints

## Users

* GET `/users`
* POST `/users`
* PUT `/users/{id}`
* DELETE `/users/{id}`

## Donations

* GET `/donations`
* POST `/donations`
* PUT `/donations/{id}`
* DELETE `/donations/{id}`

## Requests

* GET `/requests`
* POST `/requests`
* PUT `/requests/{id}`
* DELETE `/requests/{id}`

## Distributions

* GET `/distributions`
* POST `/distributions`
* PUT `/distributions/{id}`
* DELETE `/distributions/{id}`

## Feedback

* GET `/feedbacks`
* POST `/feedbacks`
* PUT `/feedbacks/{id}`
* DELETE `/feedbacks/{id}`

---

# 🧪 API Testing

Backend APIs were tested using:

* Postman
* Swagger UI

Swagger URL:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/food-waste-management-system.git
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 3️⃣ Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

# 🗄️ Database Configuration

Configure PostgreSQL in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/foodwaste
spring.datasource.username=postgres
spring.datasource.password=yourpassword
```

---

# 📸 Project Screens

* Login Page
* Signup Page
* Dashboard
* Users Management
* Donations Management
* Requests Management
* Distribution Tracking
* Feedback System

---

# 📚 Concepts Used

* REST APIs
* CRUD Operations
* React Components
* State Management
* API Integration
* JPA/Hibernate
* PostgreSQL Relationships
* Dashboard Analytics

---

# 🔮 Future Enhancements

* JWT Authentication
* Email Notifications
* Mobile Application
* Real-time Tracking
* AI-based Analytics
* Cloud Deployment

---

# 👨‍💻 Developed By

## Abhi TA

Food Waste Management System – Full Stack Project
