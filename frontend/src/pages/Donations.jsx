// src/pages/Donations.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getAllDonations, createDonation, updateDonation, deleteDonation, getAllUsers } from '../services/api.js'
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react'

const EMPTY_FORM = { userId: '', foodName: '', quantity: '', expiryTime: '', status: 'AVAILABLE' }
const STATUSES = ['AVAILABLE', 'REQUESTED', 'DISTRIBUTED']

function StatusBadge({ status }) {
  const map = {
    AVAILABLE:   'bg-green-100 text-green-700',
    REQUESTED:   'bg-blue-100 text-blue-700',
    DISTRIBUTED: 'bg-purple-100 text-purple-700',
    PENDING:     'bg-yellow-100 text-yellow-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

function Donations() {
  const [donations,  setDonations]  = useState([])
  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)
  const [toast,      setToast]      = useState(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const [d, u] = await Promise.all([getAllDonations(), getAllUsers()])
      setDonations(d.data)
      setUsers(u.data)
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openAdd() { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true) }

  function openEdit(d) {
    setForm({
      userId:     d.user?.userId || '',
      foodName:   d.foodName,
      quantity:   d.quantity,
      expiryTime: d.expiryTime ? d.expiryTime.slice(0, 16) : '',
      status:     d.status,
    })
    setEditItem(d)
    setShowModal(true)
  }

  function closeModal() { setShowModal(false); setEditItem(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.userId || !form.foodName || !form.quantity) {
      return showToast('Please fill in all required fields.', 'error')
    }
    setSaving(true)
    try {
      const payload = {
        userId:     Number(form.userId),
        foodName:   form.foodName,
        quantity:   Number(form.quantity),
        expiryTime: form.expiryTime || null,
        status:     form.status,
      }
      if (editItem) {
        await updateDonation(editItem.donationId, payload)
        showToast('Donation updated!')
      } else {
        await createDonation(payload)
        showToast('Donation added!')
      }
      closeModal()
      fetchData()
    } catch { showToast('Something went wrong.', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this donation?')) return
    try {
      await deleteDonation(id)
      showToast('Donation deleted.')
      fetchData()
    } catch { showToast('Cannot delete — linked records exist.', 'error') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Food Donations" subtitle="Manage all food donation listings" />

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
            <h2 className="text-lg font-bold text-gray-800">All Donations</h2>
            <p className="text-sm text-gray-500">{donations.length} donations listed</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow transition">
            <Plus size={16} /> Add Donation
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['#', 'Donor', 'Food Item', 'Quantity', 'Expiry Time', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d.donationId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                          {d.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{d.user?.name || 'Unknown'}</p>
                          <p className="text-gray-400 text-xs">{d.user?.phone || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">{d.foodName}</td>
                    <td className="px-5 py-3.5 text-gray-600">{d.quantity} kg</td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs">
                      {d.expiryTime ? new Date(d.expiryTime).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={d.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(d)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(d.donationId)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr><td colSpan={7} className="py-12 text-center text-gray-400">No donations yet. Add one!</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{editItem ? 'Edit Donation' : 'Add Donation'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Donor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Donor (User) *</label>
                <select name="userId" value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="">Select donor</option>
                  {users.map(u => <option key={u.userId} value={u.userId}>{u.name} ({u.email})</option>)}
                </select>
              </div>

              {/* Food Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Food Name *</label>
                <input name="foodName" value={form.foodName}
                  onChange={e => setForm({ ...form, foodName: e.target.value })}
                  placeholder="Rice, Bread, Dal..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity (kg/pcs) *</label>
                <input type="number" name="quantity" value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  placeholder="10"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              {/* Expiry Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expiry Time</label>
                <input type="datetime-local" name="expiryTime" value={form.expiryTime}
                  onChange={e => setForm({ ...form, expiryTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select name="status" value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60">
                  {saving ? 'Saving...' : editItem ? 'Update' : 'Add Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Donations
