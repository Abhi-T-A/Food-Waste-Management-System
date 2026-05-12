// src/pages/Signup.jsx

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUser } from '../services/api.js'
import { Leaf, AlertCircle, CheckCircle } from 'lucide-react'

function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'Donor',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

    setError('')
  }

  async function handleSignup(e) {
    e.preventDefault()

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.password
    ) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)

    try {
      await createUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
        role: form.role,
      })

      setSuccess(true)

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {

      if (err.response?.status === 500) {
        setError('Email may already be registered.')
      } else {
        setError('Cannot connect to server. Make sure backend is running.')
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3328] to-[#0f2318] flex items-center justify-center px-4 py-4 overflow-hidden">

      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="text-center mb-5">

          <div className="inline-flex items-center gap-2">

            <div className="bg-green-500 p-2 rounded-2xl shadow-lg">
              <Leaf size={24} className="text-white" />
            </div>

            <div className="text-left">
              <p className="font-bold text-white text-2xl leading-tight">
                Food Waste
              </p>

              <p className="text-green-400 text-sm">
                Management System
              </p>
            </div>

          </div>

          <h2 className="text-4xl font-bold text-white mt-5">
            Create Account
          </h2>

          <p className="text-gray-300 text-base mt-2">
            Join and start making a difference
          </p>

        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-7">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm rounded-2xl px-4 py-3 mb-4">
              <CheckCircle size={16} />
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Abhi T A"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address *
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="abhi@gmail.com"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="7019669540"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address *
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Kaduru, Chikkamagaluru"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password *
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white transition"
              >
                <option>Donor</option>
                <option>Volunteer</option>
                <option>Admin</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition shadow-lg shadow-green-500/30 mt-2 disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">

            Already have an account?{' '}

            <Link
              to="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Sign In
            </Link>

          </p>

        </div>
      </div>
    </div>
  )
}

export default Signup