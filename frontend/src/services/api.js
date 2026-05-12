// src/services/api.js
// All API calls to the Spring Boot backend go here.
// Base URL points to your running backend.

import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── USERS ───────────────────────────────────────────────
export const getAllUsers    = ()         => API.get('/users')
export const getUserById   = (id)       => API.get(`/users/${id}`)
export const createUser    = (data)     => API.post('/users', data)
export const updateUser    = (id, data) => API.put(`/users/${id}`, data)
export const deleteUser    = (id)       => API.delete(`/users/${id}`)

// ─── DONATIONS ───────────────────────────────────────────
export const getAllDonations  = ()         => API.get('/donations')
export const getDonationById = (id)       => API.get(`/donations/${id}`)
export const createDonation  = (data)     => API.post('/donations', data)
export const updateDonation  = (id, data) => API.put(`/donations/${id}`, data)
export const deleteDonation  = (id)       => API.delete(`/donations/${id}`)

// ─── REQUESTS ────────────────────────────────────────────
export const getAllRequests  = ()         => API.get('/requests')
export const getRequestById = (id)       => API.get(`/requests/${id}`)
export const createRequest  = (data)     => API.post('/requests', data)
export const updateRequest  = (id, data) => API.put(`/requests/${id}`, data)
export const deleteRequest  = (id)       => API.delete(`/requests/${id}`)

// ─── DISTRIBUTIONS ───────────────────────────────────────
export const getAllDistributions  = ()         => API.get('/distributions')
export const getDistributionById = (id)       => API.get(`/distributions/${id}`)
export const createDistribution  = (data)     => API.post('/distributions', data)
export const updateDistribution  = (id, data) => API.put(`/distributions/${id}`, data)
export const deleteDistribution  = (id)       => API.delete(`/distributions/${id}`)

// ─── FEEDBACK ────────────────────────────────────────────
export const getAllFeedbacks  = ()         => API.get('/feedbacks')
export const getFeedbackById = (id)       => API.get(`/feedbacks/${id}`)
export const createFeedback  = (data)     => API.post('/feedbacks', data)
export const updateFeedback  = (id, data) => API.put(`/feedbacks/${id}`, data)
export const deleteFeedback  = (id)       => API.delete(`/feedbacks/${id}`)

export default API
