// src/pages/Requests.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getAllRequests, createRequest, updateRequest, deleteRequest, getAllUsers, getAllDonations } from '../services/api.js'
import { Plus, Trash2, X, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

const EMPTY_FORM = { donationId: '', userId: '', requestDate: '', status: 'PENDING' }

function StatusBadge({ status }) {
  const map = {
    PENDING:  'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function Requests() {
  const [requests,   setRequests]   = useState([])
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
      const [r, u, d] = await Promise.all([getAllRequests(), getAllUsers(), getAllDonations()])
      setRequests(r.data)
      setUsers(u.data)
      setDonations(d.data)
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.donationId || !form.userId) return showToast('Select donation and user.', 'error')
    setSaving(true)
    try {
      await createRequest({
        donationId:  Number(form.donationId),
        userId:      Number(form.userId),
        requestDate: form.requestDate || new Date().toISOString().slice(0, 10),
        status:      'PENDING',
      })
      showToast('Request created!')
      setShowModal(false)
      setForm(EMPTY_FORM)
      fetchData()
    } catch { showToast('Failed to create request.', 'error') }
    finally { setSaving(false) }
  }

async function handleStatus(id, newStatus, req) {
  try {
    await updateRequest(id, {
      requestId: req.requestId,
      status: newStatus,
      requestDate: req.requestDate,
      user: req.user,
      foodDonation: req.foodDonation,
    })

    showToast(`Request ${newStatus.toLowerCase()}.`)
    fetchData()
  } catch (err) {
    console.log(err)
    showToast('Failed to update status.', 'error')
  }
}

  async function handleDelete(id) {
    if (!window.confirm('Delete this request?')) return
    try {
      await deleteRequest(id)
      showToast('Request deleted.')
      fetchData()
    } catch { showToast('Cannot delete this request.', 'error') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Requests" subtitle="Manage food donation requests" />

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">All Requests</h2>
            <p className="text-sm text-gray-500">{requests.length} total requests</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow transition">
            <Plus size={16} /> New Request
          </button>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {requests.map((r) => (
              <div key={r.requestId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
                      {r.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{r.user?.name || 'User'}</p>
                      <p className="text-gray-400 text-xs">{r.user?.phone || ''}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Food Item:</span>
                    <span className="font-semibold text-gray-800">{r.foodDonation?.foodName || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-semibold text-gray-800">{r.foodDonation?.quantity || '—'} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Request Date:</span>
                    <span className="font-semibold text-gray-800">{r.requestDate || '—'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-gray-100 pt-4">
                  {r.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatus(r.requestId, 'APPROVED', r)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-600 hover:bg-green-100 font-semibold text-xs rounded-xl transition">
                        <ThumbsUp size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleStatus(r.requestId, 'REJECTED', r)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-500 hover:bg-red-100 font-semibold text-xs rounded-xl transition">
                        <ThumbsDown size={13} /> Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(r.requestId)}
                    className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="col-span-3 py-16 text-center text-gray-400">No requests found.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">New Request</h3>
              <button onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }}
                className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Food Donation *</label>
                <select value={form.donationId}
                  onChange={e => setForm({ ...form, donationId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="">Select donation</option>
                  {donations.filter(d => d.status === 'AVAILABLE').map(d => (
                    <option key={d.donationId} value={d.donationId}>
                      {d.foodName} — {d.quantity}kg ({d.user?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Requester (User) *</label>
                <select value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="">Select user</option>
                  {users.map(u => <option key={u.userId} value={u.userId}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Request Date</label>
                <input type="date" value={form.requestDate}
                  onChange={e => setForm({ ...form, requestDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                  {saving ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Requests
