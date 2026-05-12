// src/components/StatCard.jsx
import React from 'react'

function StatCard({ title, value, icon: Icon, iconBg, weekChange, changeColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={26} className="text-white" />
      </div>

      {/* Text */}
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-0.5">{value}</p>
        {weekChange && (
          <p className={`text-xs font-semibold mt-1 ${changeColor || 'text-green-500'}`}>
            {weekChange}
          </p>
        )}
      </div>
    </div>
  )
}

export default StatCard
