// src/pages/Distribution.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import {
  getAllDistributions, createDistribution, updateDistribution,
  deleteDistribution, getAllDonations, getAllUsers
} from '../services/api.js'
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, Truck } from 'lucide-react'

const STATUSES = ['PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED']
const EMPTY_FORM = { donationId: '', volunteerId: '', deliveryStatus: 'PENDING' }

function StatusBadge({ status }) {
  const map = {
    PENDING:     'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    DELIVERED:   'bg-green-100 text-green-700',
    CANCELLED:   'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

function Distribution() {
  const [distributions, setDistributions] = useState([])
  const [donations,      setDonations]     = useState([])
  const [users,          setUsers]         = useState([])
  const [loading,        setLoading]       = useState(true)
  const [showModal,      setShowModal]     = useState(false)
  const [editItem,       setEditItem]      = useState(null)
  const [form,           setForm]          = useState(EMPTY_FORM)
  const [saving,         setSaving]        = useState(false)
  const [toast,          setToast]         = useState(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const [dist, don, usr] = await Promise.all([getAllDistributions(), getAllDonations(), getAllUsers()])
      setDistributions(dist.data)
      setDonations(don.data)
      setUsers(usr.data)
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
      donationId:     d.foodDonation?.donationId || '',
      volunteerId:    d.volunteer?.userId || '',
      deliveryStatus: d.deliveryStatus,
    })
    setEditItem(d)
    setShowModal(true)
  }

  function closeModal() { setShowModal(false); setEditItem(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.donationId || !form.volunteerId) return showToast('Please fill all fields.', 'error')
    setSaving(true)
    try {
      const payload = {
        donationId:     Number(form.donationId),
        volunteerId:    Number(form.volunteerId),
        deliveryStatus: form.deliveryStatus,
      }
      if (editItem) {
        await updateDistribution(editItem.distributionId, payload)
        showToast('Distribution updated!')
      } else {
        await createDistribution(payload)
        showToast('Distribution assigned!')
      }
      closeModal()
      fetchData()
    } catch { showToast('Something went wrong.', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this distribution record?')) return
    try {
      await deleteDistribution(id)
      showToast('Deleted successfully.')
      fetchData()
    } catch { showToast('Cannot delete.', 'error') }
  }

  async function quickUpdateStatus(d, newStatus) {
    try {
      await updateDistribution(d.distributionId, {
        donationId:     d.foodDonation?.donationId,
        volunteerId:    d.volunteer?.userId,
        deliveryStatus: newStatus,
      })
      showToast(`Status updated to ${newStatus}.`)
      fetchData()
    } catch { showToast('Failed to update status.', 'error') }
  }

  const summary = {
    total:    distributions.length,
    pending:  distributions.filter(d => d.deliveryStatus === 'PENDING').length,
    progress: distributions.filter(d => d.deliveryStatus === 'IN_PROGRESS').length,
    done:     distributions.filter(d => d.deliveryStatus === 'DELIVERED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Distribution" subtitle="Track and manage food delivery by volunteers" />

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total',       value: summary.total,    color: 'border-l-gray-400' },
            { label: 'Pending',     value: summary.pending,  color: 'border-l-yellow-400' },
            { label: 'In Progress', value: summary.progress, color: 'border-l-blue-400' },
            { label: 'Delivered',   value: summary.done,     color: 'border-l-green-400' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-xl p-4 border-l-4 shadow-sm ${s.color}`}>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">All Distributions</h2>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow transition">
            <Plus size={16} /> Assign Volunteer
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['#', 'Food Donation', 'Volunteer', 'Delivery Status', 'Quick Update', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {distributions.map((d, i) => (
                  <tr key={d.distributionId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800">{d.foodDonation?.foodName || '—'}</p>
                      <p className="text-gray-400 text-xs">{d.foodDonation?.quantity} kg</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {d.volunteer?.name?.charAt(0) || 'V'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{d.volunteer?.name || '—'}</p>
                          <p className="text-gray-400 text-xs">{d.volunteer?.phone || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={d.deliveryStatus} /></td>
                    <td className="px-5 py-3.5">
                      <select
                        value={d.deliveryStatus}
                        onChange={e => quickUpdateStatus(d, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                      >
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(d)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(d.distributionId)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {distributions.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">No distributions yet.</td></tr>
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
              <h3 className="font-bold text-gray-800">{editItem ? 'Edit Distribution' : 'Assign Volunteer'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Food Donation *</label>
                <select value={form.donationId}
                  onChange={e => setForm({ ...form, donationId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="">Select donation</option>
                  {donations.map(d => (
                    <option key={d.donationId} value={d.donationId}>
                      {d.foodName} — {d.quantity}kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Volunteer *</label>
                <select value={form.volunteerId}
                  onChange={e => setForm({ ...form, volunteerId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="">Select volunteer</option>
                  {users.map(u => <option key={u.userId} value={u.userId}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Status</label>
                <select value={form.deliveryStatus}
                  onChange={e => setForm({ ...form, deliveryStatus: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                  {saving ? 'Saving...' : editItem ? 'Update' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Distribution
