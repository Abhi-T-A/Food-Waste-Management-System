// src/routes/AppRoutes.jsx
// Defines all page routes. Protected routes require login.

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import GetStarted    from '../pages/GetStarted.jsx'
import Login         from '../pages/Login.jsx'
import Signup        from '../pages/Signup.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import Dashboard     from '../pages/Dashboard.jsx'
import Users         from '../pages/Users.jsx'
import Donations     from '../pages/Donations.jsx'
import Requests      from '../pages/Requests.jsx'
import Distribution  from '../pages/Distribution.jsx'
import Feedback      from '../pages/Feedback.jsx'

// ProtectedRoute checks if user is logged in (stored in localStorage)
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('fwms_user')
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"       element={<GetStarted />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard Routes - all wrapped in DashboardLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index        element={<Dashboard />} />
        <Route path="users"        element={<Users />} />
        <Route path="donations"    element={<Donations />} />
        <Route path="requests"     element={<Requests />} />
        <Route path="distribution" element={<Distribution />} />
        <Route path="feedback"     element={<Feedback />} />
      </Route>

      {/* Catch-all: redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
