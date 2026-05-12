// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAllUsers } from '../services/api.js'
import { Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      // Fetch all users and match by email (simple auth — no JWT yet)
      const res = await getAllUsers()
      const users = res.data
      const found = users.find((u) => u.email === form.email)
      if (!found) {
        setError('No account found with this email.')
        setLoading(false)
        return
      }
      // Save user to localStorage and redirect
      localStorage.setItem('fwms_user', JSON.stringify(found))
      navigate('/dashboard')
    } catch (err) {
      setError('Cannot connect to server. Make sure Spring Boot is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3328] to-[#0f2318] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="bg-green-500 p-2 rounded-xl">
              <Leaf size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-lg leading-tight">Food Waste</p>
              <p className="text-green-400 text-xs">Management System</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">Welcome Back!</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition shadow-lg shadow-green-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-600 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 Food Waste Management System
        </p>
      </div>
    </div>
  )
}

export default Login
