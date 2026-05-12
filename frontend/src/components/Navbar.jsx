// src/components/Navbar.jsx
import React, { useState } from 'react'
import { Bell, ChevronDown } from 'lucide-react'

function Navbar({ title, subtitle }) {
  const user = JSON.parse(localStorage.getItem('fwms_user') || '{}')
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title || 'Dashboard'}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition"
          >
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-400 leading-tight">Administrator</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">{user.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user.email || ''}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('fwms_user')
                  window.location.href = '/login'
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
