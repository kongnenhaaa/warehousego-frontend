'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import { Category } from '@/types'
import { Plus, Edit2, Trash2, Tag, X } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function CategoriesPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  useEffect(() => {
    if (user?.role !== 'admin') router.push('/dashboard')
  }, [user, router])

  if (user?.role !== 'admin') return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editCat) {
      setCategories(categories.map(c => c.id === editCat.id ? { ...c, ...form } : c))
    } else {
      setCategories([...categories, { id: Date.now(), ...form }])
    }
    setShowModal(false)
    setForm({ name: '', description: '' })
    setEditCat(null)
  }

  const handleEdit = (cat: Category) => {
    setEditCat(cat)
    setForm({ name: cat.name, description: cat.description })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Xóa danh mục này?')) setCategories(categories.filter(c => c.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh mục sản phẩm</h1>
          <p className="page-subtitle">{categories.length} danh mục · Chỉ Admin</p>
        </div>
        <button onClick={() => { setEditCat(null); setForm({ name: '', description: '' }); setShowModal(true) }} className="btn btn-primary">
          <Plus size={16} /> Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <div key={cat.id} className="glass glass-hover rounded-2xl p-5 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${['rgba(59,130,246,0.15)', 'rgba(16,185,129,0.15)', 'rgba(245,158,11,0.15)', 'rgba(244,63,94,0.15)', 'rgba(139,92,246,0.15)'][i % 5]}` }}>
                <Tag size={18} style={{ color: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#c4b5fd'][i % 5] }} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(cat)} className="btn btn-icon btn-secondary btn-sm"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(cat.id)} className="btn btn-icon btn-danger btn-sm"><Trash2 size={13} /></button>
              </div>
            </div>
            <h3 className="font-semibold text-white mb-1">{cat.name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {MOCK_CATEGORIES.filter(c => c.id === cat.id).length} sản phẩm
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editCat ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tên danh mục *</label>
                <input className="wh-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Điện tử" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Mô tả</label>
                <textarea className="wh-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả danh mục..." style={{ resize: 'none' }} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary">{editCat ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
