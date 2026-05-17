'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { MOCK_USERS } from '@/lib/mock-data'
import { User } from '@/types'
import { Plus, Edit2, Trash2, Users, Shield, User as UserIcon, X, Key } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function UsersPage() {
  const { user: currentUser } = useAuthStore()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' as 'admin' | 'staff', password: '' })

  useEffect(() => {
    if (currentUser?.role !== 'admin') router.push('/dashboard')
  }, [currentUser, router])

  if (currentUser?.role !== 'admin') return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, name: form.name, email: form.email, role: form.role } : u))
    } else {
      setUsers([...users, { id: Date.now(), name: form.name, email: form.email, role: form.role, created_at: new Date().toISOString() }])
    }
    setShowModal(false)
    setForm({ name: '', email: '', role: 'staff', password: '' })
    setEditUser(null)
  }

  const handleEdit = (u: User) => {
    setEditUser(u)
    setForm({ name: u.name, email: u.email, role: u.role, password: '' })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (id === currentUser?.id) return alert('Không thể xóa tài khoản đang đăng nhập!')
    if (confirm('Xóa tài khoản này?')) setUsers(users.filter(u => u.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý tài khoản</h1>
          <p className="page-subtitle">{users.length} tài khoản · Chỉ Admin</p>
        </div>
        <button onClick={() => { setEditUser(null); setForm({ name: '', email: '', role: 'staff', password: '' }); setShowModal(true) }} className="btn btn-primary">
          <Plus size={16} /> Thêm tài khoản
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
            <Shield size={20} style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Admin</div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <UserIcon size={20} style={{ color: '#34d399' }} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'staff').length}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Nhân viên</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="wh-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: u.role === 'admin' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{u.name}</div>
                        {u.id === currentUser?.id && (
                          <span className="text-xs" style={{ color: '#60a5fa' }}>● Đang đăng nhập</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    {u.role === 'admin' ? (
                      <span className="badge text-blue-400 bg-blue-400/10 border-blue-400/20">
                        <Shield size={11} className="mr-1" />👑 Admin
                      </span>
                    ) : (
                      <span className="badge text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                        👤 Staff
                      </span>
                    )}
                  </td>
                  <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(u.created_at)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(u)} className="btn btn-icon btn-secondary" title="Sửa">
                        <Edit2 size={14} />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button onClick={() => handleDelete(u.id)} className="btn btn-icon btn-danger" title="Xóa">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editUser ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Họ tên *</label>
                <input className="wh-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                <input className="wh-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@warehouse.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Vai trò</label>
                <select className="wh-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as 'admin' | 'staff' })}>
                  <option value="staff">Staff — Nhân viên</option>
                  <option value="admin">Admin — Quản trị viên</option>
                </select>
              </div>
              {!editUser && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Key size={13} className="inline mr-1" />
                    Mật khẩu tạm thời *
                  </label>
                  <input className="wh-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required={!editUser} />
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">{editUser ? 'Cập nhật' : 'Tạo tài khoản'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
