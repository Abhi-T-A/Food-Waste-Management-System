// src/pages/Users.jsx

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/api.js'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Search,
} from 'lucide-react'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  role: 'Donor',
}

function Users() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState(null)

  const [form, setForm] = useState(EMPTY_FORM)

  const [saving, setSaving] = useState(false)

  const [toast, setToast] = useState(null)

  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)

    try {
      const res = await getAllUsers()
      setUsers(res.data)
    } catch {
      showToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })

    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditUser(null)
    setShowModal(true)
  }

  function openEdit(user) {
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      password: user.password || '',
      role: user.role || 'Donor',
    })

    setEditUser(user)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditUser(null)
    setForm(EMPTY_FORM)
  }

  async function handleSave(e) {
    e.preventDefault()

    if (!form.name || !form.email) {
      return showToast('Name and Email are required', 'error')
    }

    setSaving(true)

    try {

      if (editUser) {
        await updateUser(editUser.userId, form)
        showToast('User updated successfully!')
      } else {
        await createUser(form)
        showToast('User created successfully!')
      }

      closeModal()
      fetchUsers()

    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    )

    if (!confirmDelete) return

    try {

      await deleteUser(id)

      showToast('User deleted successfully')

      fetchUsers()

    } catch {
      showToast('Cannot delete user', 'error')
    }
  }

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
        title="Users"
        subtitle="Manage all registered users"
      />

      {/* TOAST */}

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold
          ${toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
            }`}
        >
          {toast.type === 'error'
            ? <AlertCircle size={16} />
            : <CheckCircle size={16} />
          }

          {toast.msg}
        </div>
      )}

      <div className="p-6">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              All Users
            </h2>

            <p className="text-sm text-gray-500">
              {users.length} users registered
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm shadow transition"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        {/* SEARCH BAR */}

  <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {loading ? (

            <div className="p-10 text-center text-gray-500 font-semibold">
              Loading users...
            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="p-12 text-center text-gray-400">
              No users found.
            </div>

          ) : (

            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>
                  {['#', 'Name', 'Role', 'Email', 'Phone', 'Address', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((u, i) => (

                  <tr
                    key={u.userId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >

                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {i + 1}
                    </td>

                    <td className="px-5 py-3.5">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>

                        <span className="font-semibold text-gray-800">
                          {u.name}
                        </span>

                      </div>

                    </td>

                    {/* ROLE BADGE */}

                    <td className="px-5 py-3.5">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${u.role === 'Admin'
                            ? 'bg-red-100 text-red-600'
                            : u.role === 'Volunteer'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                      >
                        {u.role || 'Donor'}
                      </span>

                    </td>

                    <td className="px-5 py-3.5 text-gray-600">
                      {u.email}
                    </td>

                    <td className="px-5 py-3.5 text-gray-600">
                      {u.phone}
                    </td>

                    <td className="px-5 py-3.5 text-gray-600 max-w-[160px] truncate">
                      {u.address}
                    </td>

                    <td className="px-5 py-3.5">

                      <div className="flex gap-2">

                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(u.userId)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">

              <h3 className="font-bold text-gray-800">
                {editUser ? 'Edit User' : 'Add New User'}
              </h3>

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

            </div>

        <form
  onSubmit={handleSave}
  className="px-6 py-4 space-y-3"
>

              {[
                {
                  label: 'Full Name *',
                  name: 'name',
                  placeholder: 'Abhi T A',
                },
                {
                  label: 'Email *',
                  name: 'email',
                  placeholder: 'abhi@gmail.com',
                  type: 'email',
                },
                {
                  label: 'Phone',
                  name: 'phone',
                  placeholder: '9876543210',
                },
                {
                  label: 'Address',
                  name: 'address',
                  placeholder: 'Kaduru, Chikkamagaluru',
                },
                {
                  label: 'Password',
                  name: 'password',
                  placeholder: 'Create password',
                  type: 'password',
                }
              ].map((f) => (

                <div key={f.name}>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {f.label}
                  </label>

                  <input
                    type={f.type || 'text'}
                    name={f.name}
                    value={form[f.name] || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />

                </div>

              ))}

              {/* ROLE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option>Donor</option>
                  <option>Volunteer</option>
                  <option>Admin</option>
                </select>

              </div>

<div className="flex gap-3 pt-1">

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60"
                >
                  {saving
                    ? 'Saving...'
                    : editUser
                      ? 'Update User'
                      : 'Add User'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Users