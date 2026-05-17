'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { MOCK_SUPPLIERS } from '@/lib/mock-data'
import { Supplier } from '@/types'
import { Plus, Edit2, Trash2, Truck, Phone, Mail, MapPin, Search, X } from 'lucide-react'

export default function SuppliersPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })

  useEffect(() => {
    if (user?.role !== 'admin') router.push('/dashboard')
  }, [user, router])

  if (user?.role !== 'admin') return null

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editSupplier) {
      setSuppliers(suppliers.map(s => s.id === editSupplier.id ? { ...s, ...form } : s))
    } else {
      setSuppliers([...suppliers, { id: Date.now(), ...form }])
    }
    setShowModal(false)
    setForm({ name: '', phone: '', email: '', address: '' })
    setEditSupplier(null)
  }

  const handleEdit = (s: Supplier) => {
    setEditSupplier(s)
    setForm({ name: s.name, phone: s.phone, email: s.email, address: s.address })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Xóa nhà cung cấp này?')) setSuppliers(suppliers.filter(s => s.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Nhà cung cấp</h1>
          <p className="page-subtitle">{suppliers.length} nhà cung cấp · Chỉ Admin</p>
        </div>
        <button onClick={() => { setEditSupplier(null); setForm({ name: '', phone: '', email: '', address: '' }); setShowModal(true) }} className="btn btn-primary">
          <Plus size={16} /> Thêm nhà cung cấp
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl p-4 mb-6">
        <div className="search-bar">
          <Search size={15} className="search-icon" />
          <input className="wh-input pl-9" placeholder="Tìm tên, email nhà cung cấp..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s, i) => (
          <div key={s.id} className="glass glass-hover rounded-2xl p-5 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: `linear-gradient(135deg, ${['#3b82f6,#6366f1', '#10b981,#06b6d4', '#f59e0b,#f97316'][i % 3]})` }}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{s.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Nhà cung cấp</div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(s)} className="btn btn-icon btn-secondary btn-sm"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(s.id)} className="btn btn-icon btn-danger btn-sm"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                {s.phone}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={13} style={{ color: 'var(--text-muted)' }} />
                {s.email}
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                <span>{s.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tên nhà cung cấp *</label>
                <input className="wh-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tên công ty..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Số điện thoại</label>
                  <input className="wh-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0901234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input className="wh-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Địa chỉ</label>
                <textarea className="wh-input" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Địa chỉ..." style={{ resize: 'none' }} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">{editSupplier ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
