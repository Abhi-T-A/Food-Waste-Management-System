// src/layouts/DashboardLayout.jsx
// Shared layout for all protected dashboard pages

import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

function DashboardLayout() {

  return (

    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-[240px] overflow-y-auto">

        {/* Page Content */}
        <div className="min-h-screen flex flex-col">

          {/* Dynamic Page Content */}
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white text-center py-4 text-sm text-gray-500">
            © 2026 Food Waste Management System • Developed by Abhi T A
          </footer>

        </div>

      </main>

    </div>
  )
}

export default DashboardLayout