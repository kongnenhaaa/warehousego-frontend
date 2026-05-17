'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MOCK_IMPORT_ORDERS, MOCK_SUPPLIERS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { ImportOrder, ImportOrderItem } from '@/types'
import {
  Plus, Search, Eye, Check, X, TrendingDown,
  Trash2, FileText, ChevronDown,
} from 'lucide-react'

export default function ImportOrdersPage() {
  const [orders, setOrders] = useState<ImportOrder[]>(MOCK_IMPORT_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [viewOrder, setViewOrder] = useState<ImportOrder | null>(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleConfirm = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'confirmed' as const } : o))
  }

  const handleCancel = (id: number) => {
    if (confirm('Hủy đơn nhập hàng này?')) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'cancelled' as const } : o))
    }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Nhập hàng</h1>
          <p className="page-subtitle">Quản lý đơn nhập từ nhà cung cấp</p>
        </div>
        <button id="btn-create-import" onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} />
          Tạo đơn nhập
        </button>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Tổng đơn', value: orders.length, color: '#60a5fa' },
          { label: 'Đã xác nhận', value: orders.filter(o => o.status === 'confirmed' || o.status === 'completed').length, color: '#34d399' },
          { label: 'Đang nháp', value: orders.filter(o => o.status === 'draft').length, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="search-bar flex-1 min-w-48">
          <Search size={15} className="search-icon" />
          <input className="wh-input pl-9" placeholder="Tìm mã đơn, nhà cung cấp..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="wh-input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="draft">Nháp</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="wh-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Nhà cung cấp</th>
                <th>Số SP</th>
                <th>Tổng tiền</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td>
                    <span className="font-mono text-sm font-semibold" style={{ color: '#60a5fa' }}>{order.code}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                        {order.supplier?.name.charAt(0)}
                      </div>
                      <span className="text-sm">{order.supplier?.name}</span>
                    </div>
                  </td>
                  <td className="text-sm">{order.items?.length || 0} SP</td>
                  <td className="text-sm font-medium" style={{ color: '#60a5fa' }}>{formatCurrency(order.total_amount)}</td>
                  <td className="text-sm max-w-32 truncate" style={{ color: 'var(--text-secondary)' }}>{order.note || '—'}</td>
                  <td>
                    <span className={`badge ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </td>
                  <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(order.created_at)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewOrder(order)} className="btn btn-icon btn-secondary" title="Xem chi tiết">
                        <Eye size={14} />
                      </button>
                      {order.status === 'draft' && (
                        <>
                          <button onClick={() => handleConfirm(order.id)} className="btn btn-icon btn-success" title="Xác nhận">
                            <Check size={14} />
                          </button>
                          <button onClick={() => handleCancel(order.id)} className="btn btn-icon btn-danger" title="Hủy">
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Tạo đơn nhập hàng</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <ImportOrderForm onClose={() => setShowModal(false)} onSave={(order) => {
              setOrders([...orders, order])
              setShowModal(false)
            }} />
          </div>
        </div>
      )}

      {/* View Order Detail */}
      {viewOrder && (
        <div className="modal-overlay" onClick={() => setViewOrder(null)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Chi tiết đơn: {viewOrder.code}</h2>
              <button onClick={() => setViewOrder(null)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <OrderDetail order={viewOrder} />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function ImportOrderForm({ onClose, onSave }: { onClose: () => void; onSave: (o: ImportOrder) => void }) {
  const [supplierId, setSupplierId] = useState(1)
  const [note, setNote] = useState('')
  const [items, setItems] = useState<ImportOrderItem[]>([{ product_id: 1, quantity: 1, unit_price: 0 }])

  const addItem = () => setItems([...items, { product_id: 1, quantity: 1, unit_price: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newOrder: ImportOrder = {
      id: Date.now(),
      code: `NK-2024-${String(Date.now()).slice(-3)}`,
      supplier_id: supplierId,
      supplier: MOCK_SUPPLIERS.find(s => s.id === supplierId),
      user_id: 1,
      status: 'draft',
      total_amount: total,
      note,
      created_at: new Date().toISOString(),
      items: items.map((item, i) => ({
        ...item,
        id: i + 1,
        product: MOCK_PRODUCTS.find(p => p.id === item.product_id),
      })),
    }
    onSave(newOrder)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nhà cung cấp *</label>
          <select className="wh-input" value={supplierId} onChange={e => setSupplierId(Number(e.target.value))}>
            {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Ghi chú</label>
          <input className="wh-input" value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú thêm..." />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Danh sách sản phẩm</label>
          <button type="button" onClick={addItem} className="btn btn-sm btn-secondary">
            <Plus size={13} /> Thêm SP
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <select className="wh-input text-sm" value={item.product_id} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, product_id: Number(e.target.value) } : it))}>
                  {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <input type="number" className="wh-input text-sm" min={1} value={item.quantity} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, quantity: Number(e.target.value) } : it))} placeholder="SL" />
              </div>
              <div className="col-span-4">
                <input type="number" className="wh-input text-sm" min={0} value={item.unit_price} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, unit_price: Number(e.target.value) } : it))} placeholder="Đơn giá (VND)" />
              </div>
              <div className="col-span-1 flex justify-center">
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="btn btn-icon btn-danger">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-3 px-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tổng tiền</span>
        <span className="text-lg font-bold" style={{ color: '#60a5fa' }}>{formatCurrency(total)}</span>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn btn-secondary">Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu đơn nháp</button>
      </div>
    </form>
  )
}

function OrderDetail({ order }: { order: ImportOrder }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Nhà cung cấp', value: order.supplier?.name },
          { label: 'Trạng thái', value: getStatusLabel(order.status) },
          { label: 'Tổng tiền', value: formatCurrency(order.total_amount) },
          { label: 'Ngày tạo', value: formatDateTime(order.created_at) },
          { label: 'Ghi chú', value: order.note || '—' },
        ].map(r => (
          <div key={r.label}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{r.label}</div>
            <div className="text-sm font-medium text-white">{r.value}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Chi tiết sản phẩm</div>
        {order.items && order.items.length > 0 ? (
          <table className="wh-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="text-sm">{item.product?.name || `SP #${item.product_id}`}</td>
                  <td className="text-sm">{item.quantity}</td>
                  <td className="text-sm">{formatCurrency(item.unit_price)}</td>
                  <td className="text-sm font-medium">{formatCurrency(item.quantity * item.unit_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Chưa có sản phẩm nào</p>
        )}
      </div>
    </div>
  )
}
