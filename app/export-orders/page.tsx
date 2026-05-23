'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MOCK_EXPORT_ORDERS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { ExportOrder, ExportOrderItem } from '@/types'
import { Plus, Search, Eye, Check, X, Trash2, AlertTriangle } from 'lucide-react'

export default function ExportOrdersPage() {
  const [orders, setOrders] = useState<ExportOrder[]>(MOCK_EXPORT_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [viewOrder, setViewOrder] = useState<ExportOrder | null>(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleConfirm = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'confirmed' as const } : o))
  }
  const handleCancel = (id: number) => {
    if (confirm('Hủy đơn xuất hàng này?')) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'cancelled' as const } : o))
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Xuất hàng</h1>
          <p className="page-subtitle">Quản lý đơn xuất cho khách hàng</p>
        </div>
        <button id="btn-create-export" onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} />
          Tạo đơn xuất
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Tổng đơn', value: orders.length, color: '#34d399' },
          { label: 'Đã xác nhận', value: orders.filter(o => o.status !== 'draft' && o.status !== 'cancelled').length, color: '#60a5fa' },
          { label: 'Tổng doanh thu', value: formatCurrency(orders.reduce((sum, o) => sum + o.total_amount, 0)), color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="glass glass-hover rounded-2xl p-4 text-center">
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass glass-hover rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="search-bar flex-1 min-w-48">
          <Search size={15} className="search-icon" />
          <input className="wh-input pl-9" placeholder="Tìm mã đơn, tên khách..." value={search} onChange={e => setSearch(e.target.value)} />
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
      <div className="glass glass-hover rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="wh-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
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
                    <span className="font-mono text-sm font-semibold" style={{ color: '#34d399' }}>{order.code}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                        {order.customer_name.charAt(0)}
                      </div>
                      <span className="text-sm">{order.customer_name}</span>
                    </div>
                  </td>
                  <td className="text-sm">{order.items?.length || 0} SP</td>
                  <td className="text-sm font-medium" style={{ color: '#34d399' }}>{formatCurrency(order.total_amount)}</td>
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

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Tạo đơn xuất hàng</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <ExportOrderForm onClose={() => setShowModal(false)} onSave={(order) => {
              setOrders([...orders, order])
              setShowModal(false)
            }} />
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewOrder && (
        <div className="modal-overlay" onClick={() => setViewOrder(null)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Chi tiết đơn: {viewOrder.code}</h2>
              <button onClick={() => setViewOrder(null)} className="btn btn-icon btn-secondary"><X size={16} /></button>
            </div>
            <ExportDetail order={viewOrder} />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function ExportOrderForm({ onClose, onSave }: { onClose: () => void; onSave: (o: ExportOrder) => void }) {
  const [customerName, setCustomerName] = useState('')
  const [note, setNote] = useState('')
  const [items, setItems] = useState<ExportOrderItem[]>([{ product_id: 1, quantity: 1, unit_price: 0 }])
  const [stockWarning, setStockWarning] = useState('')

  const addItem = () => setItems([...items, { product_id: 1, quantity: 1, unit_price: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const total = items.reduce((s, it) => s + it.quantity * it.unit_price, 0)

  const checkStock = (productId: number, qty: number) => {
    const p = MOCK_PRODUCTS.find(p => p.id === productId)
    if (p && qty > (p.total_quantity ?? 0)) {
      setStockWarning(`Sản phẩm "${p.name}" chỉ còn ${p.total_quantity} ${p.unit}!`)
    } else {
      setStockWarning('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim()) return alert('Vui lòng nhập tên khách hàng')
    const newOrder: ExportOrder = {
      id: Date.now(),
      code: `XK-2024-${String(Date.now()).slice(-3)}`,
      customer_name: customerName,
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
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tên khách hàng *</label>
          <input className="wh-input" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Tên khách hàng..." required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Ghi chú</label>
          <input className="wh-input" value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú thêm..." />
        </div>
      </div>

      {stockWarning && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
          <AlertTriangle size={14} />
          {stockWarning}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Sản phẩm xuất kho</label>
          <button type="button" onClick={addItem} className="btn btn-sm btn-secondary"><Plus size={13} /> Thêm SP</button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <select className="wh-input text-sm" value={item.product_id} onChange={e => {
                  const pid = Number(e.target.value)
                  const p = MOCK_PRODUCTS.find(p => p.id === pid)
                  setItems(items.map((it, idx) => idx === i ? { ...it, product_id: pid, unit_price: p?.sell_price || 0 } : it))
                  checkStock(pid, item.quantity)
                }}>
                  {MOCK_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (còn {p.total_quantity})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <input type="number" className="wh-input text-sm" min={1} value={item.quantity} onChange={e => {
                  const qty = Number(e.target.value)
                  setItems(items.map((it, idx) => idx === i ? { ...it, quantity: qty } : it))
                  checkStock(item.product_id, qty)
                }} placeholder="SL" />
              </div>
              <div className="col-span-4">
                <input type="number" className="wh-input text-sm" min={0} value={item.unit_price} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, unit_price: Number(e.target.value) } : it))} placeholder="Đơn giá" />
              </div>
              <div className="col-span-1 flex justify-center">
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="btn btn-icon btn-danger"><Trash2 size={13} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center py-3 px-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tổng tiền</span>
        <span className="text-lg font-bold" style={{ color: '#34d399' }}>{formatCurrency(total)}</span>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn btn-secondary">Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu đơn nháp</button>
      </div>
    </form>
  )
}

function ExportDetail({ order }: { order: ExportOrder }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Khách hàng', value: order.customer_name },
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
            <thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
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
