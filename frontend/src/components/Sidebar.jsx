// src/components/Sidebar.jsx
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Gift, ClipboardList,
  Truck, Star, LogOut, Menu, X, Leaf
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Users',          icon: Users,            path: '/dashboard/users' },
  { label: 'Food Donations', icon: Gift,             path: '/dashboard/donations' },
  { label: 'Requests',       icon: ClipboardList,    path: '/dashboard/requests' },
  { label: 'Distributions',  icon: Truck,            path: '/dashboard/distribution' },
  { label: 'Feedback',       icon: Star,             path: '/dashboard/feedback' },
]

function Sidebar() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const user = JSON.parse(localStorage.getItem('fwms_user') || '{}')

  function handleLogout() {
    localStorage.removeItem('fwms_user')
    navigate('/login')
  }

  return (
    <aside
      className={`
        flex flex-col h-screen bg-[#1a3328] text-white
        transition-all duration-300 fixed left-0 top-0 z-40
        ${collapsed ? 'w-[70px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#2d5a45]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Food Waste</p>
              <p className="text-[10px] text-green-400 leading-tight">Management System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="bg-green-500 p-1.5 rounded-lg mx-auto">
            <Leaf size={20} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-green-400 hover:text-white ml-auto"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 cursor-pointer
                 font-semibold text-sm transition-all
                 ${isActive
                   ? 'bg-green-500 text-white shadow-lg'
                   : 'text-green-200 hover:bg-[#2d5a45] hover:text-white'
                 }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Settings */}
     <div className="border-t border-[#2d5a45] p-4">

  {!collapsed && (
    <div className="mb-3">
      <div className="flex items-center gap-3 mb-3">

        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-sm">
          ⚙️
        </div>

        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate">
            Settings
          </p>

          <p className="text-[11px] text-green-400 truncate">
            Manage account
          </p>
        </div>

      </div>
    </div>
  )}

  <button
    onClick={handleLogout}
    className={`flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold text-sm w-full py-2 px-2 rounded-lg hover:bg-red-500/10 transition-all ${
      collapsed ? 'justify-center' : ''
    }`}
  >
    <LogOut size={16} />

    {!collapsed && <span>Logout</span>}
  </button>

</div>
    </aside>
  )
}

export default Sidebar
