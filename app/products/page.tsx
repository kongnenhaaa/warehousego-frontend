'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Product } from '@/types'
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, Package, AlertTriangle,
  X, ChevronDown,
} from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewProduct, setViewProduct] = useState<Product | null>(null)

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.category_id === categoryFilter
    return matchSearch && matchCat
  })

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleNew = () => {
    setSelectedProduct(null)
    setShowModal(true)
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Sản phẩm</h1>
          <p className="page-subtitle">{products.length} sản phẩm trong kho</p>
        </div>
        <button id="btn-add-product" onClick={handleNew} className="btn btn-primary">
          <Plus size={16} />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="glass glass-hover rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="search-bar flex-1 min-w-48">
          <Search size={15} className="search-icon" />
          <input
            className="wh-input pl-9"
            placeholder="Tìm theo tên, SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <select
            className="wh-input pl-9"
            style={{ minWidth: 180 }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Tất cả danh mục</option>
            {MOCK_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span>{filtered.length} kết quả</span>
        </div>
      </div>

      {/* Table */}
      <div className="glass glass-hover rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="wh-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Đơn vị</th>
                <th>Giá nhập</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-state">
                      <Package size={40} style={{ color: 'var(--text-muted)' }} className="mb-3" />
                      <p style={{ color: 'var(--text-secondary)' }}>Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isLow = (p.total_quantity ?? 0) < p.min_stock
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className="font-mono text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>{p.sku}</span>
                      </td>
                      <td>
                        <div className="font-medium text-white">{p.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.supplier?.name}</div>
                      </td>
                      <td>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>
                          {p.category?.name}
                        </span>
                      </td>
                      <td className="text-sm">{p.unit}</td>
                      <td className="text-sm">{formatCurrency(p.cost_price)}</td>
                      <td className="text-sm font-medium" style={{ color: '#34d399' }}>{formatCurrency(p.sell_price)}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {isLow && <AlertTriangle size={13} style={{ color: '#f87171' }} />}
                          <span className={`font-semibold ${isLow ? 'text-red-400' : 'text-white'}`}>
                            {p.total_quantity ?? 0}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ min {p.min_stock}</span>
                        </div>
                      </td>
                      <td>
                        {isLow ? (
                          <span className="badge text-red-400 bg-red-400/10 border-red-400/20">Sắp hết</span>
                        ) : (
                          <span className="badge text-emerald-400 bg-emerald-400/10 border-emerald-400/20">Còn hàng</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewProduct(p)} className="btn btn-icon btn-secondary" title="Xem chi tiết">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handleEdit(p)} className="btn btn-icon btn-secondary" title="Sửa">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="btn btn-icon btn-danger" title="Xóa">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="btn btn-icon btn-secondary">
                <X size={16} />
              </button>
            </div>
            <ProductForm product={selectedProduct} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewProduct && (
        <div className="modal-overlay" onClick={() => setViewProduct(null)}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Chi tiết sản phẩm</h2>
              <button onClick={() => setViewProduct(null)} className="btn btn-icon btn-secondary">
                <X size={16} />
              </button>
            </div>
            <ProductDetail product={viewProduct} />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function ProductForm({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [form, setForm] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    category_id: product?.category_id || 1,
    supplier_id: product?.supplier_id || 1,
    unit: product?.unit || 'Cái',
    cost_price: product?.cost_price || 0,
    sell_price: product?.sell_price || 0,
    min_stock: product?.min_stock || 10,
  })

  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); onClose() }}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>SKU</label>
          <input className="wh-input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="VD: SPH-001" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Đơn vị</label>
          <input className="wh-input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="Cái, Hộp, Thùng..." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tên sản phẩm</label>
        <input className="wh-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tên sản phẩm..." required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Danh mục</label>
          <select className="wh-input" value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}>
            {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tồn kho tối thiểu</label>
          <input className="wh-input" type="number" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: Number(e.target.value) })} min={0} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Giá nhập (VND)</label>
          <input className="wh-input" type="number" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: Number(e.target.value) })} min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Giá bán (VND)</label>
          <input className="wh-input" type="number" value={form.sell_price} onChange={e => setForm({ ...form, sell_price: Number(e.target.value) })} min={0} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn btn-secondary">Hủy</button>
        <button type="submit" className="btn btn-primary">
          {product ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>
    </form>
  )
}

function ProductDetail({ product }: { product: Product }) {
  const rows = [
    { label: 'SKU', value: product.sku },
    { label: 'Danh mục', value: product.category?.name },
    { label: 'Nhà cung cấp', value: product.supplier?.name },
    { label: 'Đơn vị', value: product.unit },
    { label: 'Giá nhập', value: formatCurrency(product.cost_price) },
    { label: 'Giá bán', value: formatCurrency(product.sell_price) },
    { label: 'Tồn kho hiện tại', value: `${product.total_quantity} ${product.unit}` },
    { label: 'Tồn kho tối thiểu', value: `${product.min_stock} ${product.unit}` },
    { label: 'Ngày cập nhật', value: formatDateTime(product.updated_at) },
  ]
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">{product.name}</h3>
      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
            <span className="text-sm font-medium text-white">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
