// src/pages/GetStarted.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Heart, Truck, Star, ArrowRight, Users } from 'lucide-react'

const features = [
  {
    icon: Leaf,
    title: 'Smart Donations',
    desc: 'Easily list and manage food donations with expiry tracking.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Users,
    title: 'Community Requests',
    desc: 'NGOs and individuals can request available food donations.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Truck,
    title: 'Volunteer Distribution',
    desc: 'Volunteers track and deliver food to those in need.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Star,
    title: 'Feedback System',
    desc: 'Rate and review donation experiences to improve quality.',
    color: 'bg-purple-100 text-purple-600',
  },
]

function GetStarted() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3328] via-[#1e4035] to-[#0f2318] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-xl">
            <Leaf size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base leading-tight">Food Waste</p>
            <p className="text-[11px] text-green-400">Management System</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-semibold border border-green-500 text-green-400 rounded-xl hover:bg-green-500 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 text-sm font-semibold bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <Heart size={14} />
          <span>Reducing Food Waste, Spreading Hope</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Don't Waste Food,
          <span className="text-green-400"> Share It!</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          A complete platform to connect food donors, volunteers, and communities.
          Every meal saved is a life impacted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition text-base shadow-lg shadow-green-500/30"
          >
            Get Started Free <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition text-base"
          >
            Already have an account?
          </button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white/5 border-y border-white/10 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '5000+', label: 'Meals Saved' },
            { value: '200+', label: 'Active Donors' },
            { value: '50+', label: 'NGO Partners' },
            { value: '98%', label: 'Success Rate' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-green-400">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Everything You Need</h2>
        <p className="text-gray-400 text-center mb-12 text-base">
          One platform to manage the entire food donation lifecycle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-20 px-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-300 mb-8">Join thousands of donors and volunteers making an impact every day.</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-3.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/30"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/10 text-gray-500 text-sm">
        © 2026 Food Waste Management System.Developed by Abhi T A. All rights reserved.
      </footer>
    </div>
  )
}

export default GetStarted
