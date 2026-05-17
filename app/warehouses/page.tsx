'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { MOCK_WAREHOUSES } from '@/lib/mock-data'
import { Warehouse } from '@/types'
import { Plus, Edit2, Trash2, MapPin, X } from 'lucide-react'

export default function WarehousesPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [warehouses, setWarehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES)
  const [showModal, setShowModal] = useState(false)
  const [editWh, setEditWh] = useState<Warehouse | null>(null)
  const [form, setForm] = useState({ name: '', location: '' })

  useEffect(() => {
    if (user?.role !== 'admin') router.push('/dashboard')
  }, [user, router])

  if (user?.role !== 'admin') return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editWh) {
      setWarehouses(warehouses.map(w => w.id === editWh.id ? { ...w, ...form } : w))
    } else {
      setWarehouses([...warehouses, { id: Date.now(), ...form }])
    }
    setShowModal(false)
    setForm({ name: '', location: '' })
    setEditWh(null)
  }

  const handleEdit = (w: Warehouse) => {
    setEditWh(w)
    setForm({ name: w.name, location: w.location })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Xóa kho này?')) setWarehouses(warehouses.filter(w => w.id !== id))
  }

  const BG_COLORS = [
    'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))',
    'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))',
    'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.2))',
    'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(244,63,94,0.2))',
  ]
  const ICON_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#c4b5fd']

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Kho lưu trữ</h1>
          <p className="page-subtitle">{warehouses.length} kho đang hoạt động · Chỉ Admin</p>
        </div>
        <button onClick={() => { setEditWh(null); setForm({ name: '', location: '' }); setShowModal(true) }} className="btn btn-primary">
          <Plus size={16} /> Thêm kho
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((w, i) => (
          <div key={w.id} className="glass glass-hover rounded-2xl p-6 group relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ background: BG_COLORS[i % BG_COLORS.length] }} />

            <div className="relative">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: BG_COLORS[i % BG_COLORS.length] }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ICON_COLORS[i % ICON_COLORS.length]} strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(w)} className="btn btn-icon btn-secondary btn-sm"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(w.id)} className="btn btn-icon btn-danger btn-sm"><Trash2 size={13} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{w.name}</h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                {w.location}
              </div>
              <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: ICON_COLORS[i % ICON_COLORS.length] }}>—</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: ICON_COLORS[i % ICON_COLORS.length] }}>—</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tổng SL</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editWh ? 'Sửa kho' : 'Thêm kho mới'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tên kho *</label>
                <input className="wh-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Kho A - Tầng 1" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Địa điểm</label>
                <input className="wh-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="VD: Quận 9, TP.HCM" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">{editWh ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
