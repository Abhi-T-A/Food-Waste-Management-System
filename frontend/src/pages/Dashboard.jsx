// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Gift, ClipboardList, Truck, Star, Eye } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import StatCard from '../components/StatCard.jsx'
import { getAllDonations, getAllRequests, getAllDistributions, getAllFeedbacks } from '../services/api.js'

// Chart data (static demo data for the visual overview)
const donationChartData = [
  { day: '1 May', donations: 8 },
  { day: '6 May', donations: 15 },
  { day: '11 May', donations: 22 },
  { day: '16 May', donations: 32 },
  { day: '21 May', donations: 27 },
  { day: '26 May', donations: 33 },
  { day: '31 May', donations: 28 },
]

const distPieData = [
  { name: 'Delivered',   value: 45, color: '#22c55e' },
  { name: 'In Transit',  value: 10, color: '#3b82f6' },
  { name: 'Pending',     value: 7,  color: '#f97316' },
  { name: 'Cancelled',   value: 2,  color: '#a855f7' },
]

function StatusBadge({ status }) {
  const map = {
    AVAILABLE:   'bg-green-100 text-green-700',
    PENDING:     'bg-yellow-100 text-yellow-700',
    REQUESTED:   'bg-blue-100 text-blue-700',
    DISTRIBUTED: 'bg-purple-100 text-purple-700',
    APPROVED:    'bg-green-100 text-green-700',
    REJECTED:    'bg-red-100 text-red-700',
    DELIVERED:   'bg-green-100 text-green-700',
    CANCELLED:   'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('fwms_user') || '{}')

  const [donations,      setDonations]      = useState([])
  const [requests,       setRequests]       = useState([])
  const [distributions,  setDistributions]  = useState([])
  const [feedbacks,      setFeedbacks]      = useState([])
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [d, r, dist, f] = await Promise.all([
          getAllDonations(),
          getAllRequests(),
          getAllDistributions(),
          getAllFeedbacks(),
        ])
        setDonations(d.data)
        setRequests(r.data)
        setDistributions(dist.data)
        setFeedbacks(f.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const stats = [
    { title: 'Total Donations',     value: donations.length,     icon: Gift,          iconBg: 'bg-green-500',  weekChange: '+12 this week', changeColor: 'text-green-500' },
    { title: 'Total Requests',      value: requests.length,      icon: ClipboardList, iconBg: 'bg-blue-500',   weekChange: '+8 this week',  changeColor: 'text-blue-500' },
    { title: 'Total Distributions', value: distributions.length, icon: Truck,         iconBg: 'bg-orange-500', weekChange: '+10 this week', changeColor: 'text-orange-500' },
    { title: 'Total Feedback',      value: feedbacks.length,     icon: Star,          iconBg: 'bg-purple-500', weekChange: '+5 this week',  changeColor: 'text-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Dashboard"
        subtitle={`Welcome back, ${user.name || 'Admin'}! Here's what's happening today.`}
      />

      <div className="p-6 space-y-6">
        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Line Chart */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-base">Donations Overview</h2>
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">This Month</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={donationChartData}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Area type="monotone" dataKey="donations" stroke="#22c55e" strokeWidth={2.5}
                  fill="url(#greenGrad)" dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-base">Distribution Overview</h2>
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">This Month</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={distPieData} cx="50%" cy="50%"
                  innerRadius={60} outerRadius={85}
                  paddingAngle={3} dataKey="value"
                >
                  {distPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle" iconSize={10}
                  formatter={(value) => <span style={{ fontSize: 12, color: '#555' }}>{value}</span>}
                />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Donations + Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Recent Donations Table */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-base">Recent Donations</h2>
              <button
                onClick={() => navigate('/dashboard/donations')}
                className="text-xs text-green-600 font-semibold hover:underline"
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-semibold text-xs">Donor</th>
                    <th className="text-left py-2 text-gray-500 font-semibold text-xs">Food Item</th>
                    <th className="text-left py-2 text-gray-500 font-semibold text-xs">Qty</th>
                    <th className="text-left py-2 text-gray-500 font-semibold text-xs">Status</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 5).map((d) => (
                    <tr key={d.donationId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                            {d.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-xs">{d.user?.name || 'Unknown'}</p>
                            <p className="text-gray-400 text-[10px]">{d.user?.phone || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-700 text-xs">{d.foodName}</td>
                      <td className="py-3 text-gray-700 text-xs">{d.quantity} kg</td>
                      <td className="py-3"><StatusBadge status={d.status} /></td>
                      <td className="py-3">
                        <Eye size={14} className="text-gray-400 cursor-pointer hover:text-green-500" />
                      </td>
                    </tr>
                  ))}
                  {donations.length === 0 && !loading && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No donations yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-base">Recent Requests</h2>
              <button
                onClick={() => navigate('/dashboard/requests')}
                className="text-xs text-green-600 font-semibold hover:underline"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {requests.slice(0, 5).map((r) => (
                <div key={r.requestId} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                      {r.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{r.user?.name || 'User'}</p>
                      <p className="text-gray-400 text-xs">{r.foodDonation?.foodName || 'Food item'}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
              {requests.length === 0 && !loading && (
                <p className="text-center text-gray-400 text-sm py-6">No requests yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
