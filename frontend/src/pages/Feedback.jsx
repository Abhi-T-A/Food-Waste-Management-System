// src/pages/Feedback.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import {
  getAllFeedbacks, createFeedback, deleteFeedback,
  getAllUsers, getAllDonations
} from '../services/api.js'
import { Plus, Trash2, X, Star, CheckCircle, AlertCircle } from 'lucide-react'

const EMPTY_FORM = { userId: '', donationId: '', rating: 5, comments: '' }

function StarRating({ rating, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={`text-2xl transition ${star <= rating ? 'text-yellow-400' : 'text-gray-200'} ${onChange ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function Feedback() {
  const [feedbacks,  setFeedbacks]  = useState([])
  const [users,      setUsers]      = useState([])
  const [donations,  setDonations]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)
  const [toast,      setToast]      = useState(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const [f, u, d] = await Promise.all([getAllFeedbacks(), getAllUsers(), getAllDonations()])
      setFeedbacks(f.data)
      setUsers(u.data)
      setDonations(d.data)
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.userId || !form.donationId) return showToast('Please select user and donation.', 'error')
    if (!form.comments.trim()) return showToast('Please add a comment.', 'error')
    setSaving(true)
    try {
      await createFeedback({
        userId:     Number(form.userId),
        donationId: Number(form.donationId),
        rating:     Number(form.rating),
        comments:   form.comments,
      })
      showToast('Feedback submitted!')
      setShowModal(false)
      setForm(EMPTY_FORM)
      fetchData()
    } catch { showToast('Failed to submit feedback.', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this feedback?')) return
    try {
      await deleteFeedback(id)
      showToast('Feedback deleted.')
      fetchData()
    } catch { showToast('Cannot delete.', 'error') }
  }

  // Average rating
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Feedback" subtitle="View and manage donation feedback" />

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-yellow-400">
            <p className="text-3xl font-bold text-gray-800">{feedbacks.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Feedback</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-green-400">
            <p className="text-3xl font-bold text-gray-800">{avgRating}</p>
            <p className="text-sm text-gray-500 mt-1">Average Rating ⭐</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-blue-400">
            <p className="text-3xl font-bold text-gray-800">
              {feedbacks.filter(f => f.rating >= 4).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Positive (4★+)</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">All Feedback</h2>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow transition">
            <Plus size={16} /> Add Feedback
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {feedbacks.map((f) => (
              <div key={f.feedbackId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                {/* User & Rating */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      {f.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{f.user?.name || 'User'}</p>
                      <p className="text-gray-400 text-xs">{f.user?.email || ''}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(f.feedbackId)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Star Rating */}
                <StarRating rating={f.rating || 0} />

                {/* Food Donation */}
                <div className="mt-3 mb-2">
                  <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    {f.foodDonation?.foodName || 'Food item'}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm leading-relaxed mt-2 border-t border-gray-50 pt-3">
                  {f.comments || <span className="text-gray-300 italic">No comment</span>}
                </p>
              </div>
            ))}
            {feedbacks.length === 0 && (
              <div className="col-span-3 py-16 text-center text-gray-400">No feedback yet.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Add Feedback</h3>
              <button onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }}
                className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">User *</label>
                <select value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="">Select user</option>
                  {users.map(u => <option key={u.userId} value={u.userId}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Food Donation *</label>
                <select value={form.donationId}
                  onChange={e => setForm({ ...form, donationId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="">Select donation</option>
                  {donations.map(d => (
                    <option key={d.donationId} value={d.donationId}>
                      {d.foodName} ({d.user?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                <StarRating rating={form.rating} onChange={r => setForm({ ...form, rating: r })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comments *</label>
                <textarea
                  value={form.comments}
                  onChange={e => setForm({ ...form, comments: e.target.value })}
                  rows={3}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                  {saving ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feedback
