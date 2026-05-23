'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  MOCK_PRODUCTS, MOCK_LOW_STOCK, MOCK_CHART_DATA,
  MOCK_TRANSACTIONS, MOCK_IMPORT_ORDERS, MOCK_EXPORT_ORDERS,
} from '@/lib/mock-data'
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Download, BarChart3, TrendingDown, TrendingUp, AlertTriangle, History } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4']

const chartTooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#f1f5f9',
  fontSize: '12px',
}

const tabs = ['Tổng quan', 'Tồn kho', 'Giao dịch', 'Nhập/Xuất']

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Tổng quan')
  const [dateRange, setDateRange] = useState('week')

  // Category distribution for pie chart
  const categoryData = MOCK_PRODUCTS.reduce((acc, p) => {
    const cat = p.category?.name || 'Khác'
    const existing = acc.find(a => a.name === cat)
    if (existing) existing.value += p.total_quantity || 0
    else acc.push({ name: cat, value: p.total_quantity || 0 })
    return acc
  }, [] as { name: string; value: number }[])

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Báo cáo & Thống kê</h1>
          <p className="page-subtitle">Tổng hợp dữ liệu kho hàng theo thời gian</p>
        </div>
        <div className="flex gap-3">
          <select className="wh-input" style={{ width: 140 }} value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
          </select>
          <button className="btn btn-secondary">
            <Download size={15} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', width: 'fit-content', border: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'text-white' : ''}`}
            style={activeTab === tab ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white' } : { color: 'var(--text-secondary)' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Tổng quan */}
      {activeTab === 'Tổng quan' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tổng nhập tuần', value: formatCurrency(MOCK_CHART_DATA.reduce((s, d) => s + d.imports, 0)), icon: TrendingDown, color: '#60a5fa' },
              { label: 'Tổng xuất tuần', value: formatCurrency(MOCK_CHART_DATA.reduce((s, d) => s + d.exports, 0)), icon: TrendingUp, color: '#34d399' },
              { label: 'Tổng doanh thu', value: formatCurrency(MOCK_CHART_DATA.reduce((s, d) => s + d.revenue, 0)), icon: BarChart3, color: '#fbbf24' },
              { label: 'SP sắp hết', value: `${MOCK_LOW_STOCK.length} sản phẩm`, icon: AlertTriangle, color: '#f87171' },
            ].map(kpi => {
              const Icon = kpi.icon
              return (
                <div key={kpi.label} className="glass glass-hover rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}20` }}>
                      <Icon size={16} style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-white">{kpi.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{kpi.label}</div>
                </div>
              )
            })}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 glass glass-hover rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-5">Biểu đồ Nhập / Xuất</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => typeof v === 'number' ? formatCurrency(v) : ''} />
                  <Legend formatter={v => v === 'imports' ? 'Nhập hàng' : 'Xuất hàng'} />
                  <Area type="monotone" dataKey="imports" stroke="#3b82f6" strokeWidth={2} fill="url(#colorI)" />
                  <Area type="monotone" dataKey="exports" stroke="#10b981" strokeWidth={2} fill="url(#colorE)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass glass-hover rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-5">Phân bổ tồn kho theo danh mục</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tồn kho */}
      {activeTab === 'Tồn kho' && (
        <div className="space-y-6">
          {/* Low stock alert */}
          <div className="glass glass-hover rounded-2xl p-5" style={{ borderTop: '2px solid #f43f5e' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} style={{ color: '#f87171' }} />
              <h3 className="font-semibold text-white">Sản phẩm sắp hết hàng</h3>
              <span className="badge text-red-400 bg-red-400/10 border-red-400/20 ml-2">{MOCK_LOW_STOCK.length} SP</span>
            </div>
            <div className="space-y-3">
              {MOCK_LOW_STOCK.map(item => {
                const pct = Math.min(100, (item.current_quantity / item.min_stock) * 100)
                return (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-white">{item.product.name}</span>
                        <span style={{ color: '#f87171' }}>{item.current_quantity} / {item.min_stock} {item.product.unit}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: pct < 30 ? '#f43f5e' : '#f59e0b' }} />
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.15)', color: '#f87171' }}>
                      {Math.round(pct)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* All inventory */}
          <div className="glass glass-hover rounded-2xl overflow-hidden">
            <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white">Tồn kho toàn bộ sản phẩm</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="wh-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>SKU</th>
                    <th>Danh mục</th>
                    <th>Tồn kho</th>
                    <th>Tối thiểu</th>
                    <th>Giá trị tồn</th>
                    <th>Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PRODUCTS.map(p => {
                    const qty = p.total_quantity ?? 0
                    const isLow = qty < p.min_stock
                    const value = qty * p.cost_price
                    return (
                      <tr key={p.id}>
                        <td className="font-medium text-white">{p.name}</td>
                        <td><span className="font-mono text-xs text-slate-400">{p.sku}</span></td>
                        <td><span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>{p.category?.name}</span></td>
                        <td className={`font-semibold ${isLow ? 'text-red-400' : 'text-white'}`}>{qty} {p.unit}</td>
                        <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.min_stock} {p.unit}</td>
                        <td className="text-sm font-medium" style={{ color: '#34d399' }}>{formatCurrency(value)}</td>
                        <td>
                          {isLow ? (
                            <span className="badge text-red-400 bg-red-400/10 border-red-400/20">⚠ Sắp hết</span>
                          ) : (
                            <span className="badge text-emerald-400 bg-emerald-400/10 border-emerald-400/20">✓ Đủ hàng</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Giao dịch */}
      {activeTab === 'Giao dịch' && (
        <div className="glass glass-hover rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <History size={16} style={{ color: '#60a5fa' }} />
            <h3 className="font-semibold text-white">Lịch sử giao dịch kho</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="wh-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sản phẩm</th>
                  <th>Kho</th>
                  <th>Loại</th>
                  <th>Thay đổi SL</th>
                  <th>Ghi chú</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map(tx => (
                  <tr key={tx.id}>
                    <td className="text-xs" style={{ color: 'var(--text-muted)' }}>#{tx.id}</td>
                    <td className="text-sm font-medium text-white">{tx.product?.name}</td>
                    <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>Kho #{tx.warehouse_id}</td>
                    <td>
                      <span className={`badge ${tx.type === 'import' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                        {tx.type === 'import' ? '↓ Nhập' : '↑ Xuất'}
                      </span>
                    </td>
                    <td className={`text-sm font-bold ${tx.quantity_change > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {tx.quantity_change > 0 ? '+' : ''}{tx.quantity_change}
                    </td>
                    <td className="text-sm max-w-40 truncate" style={{ color: 'var(--text-secondary)' }}>{tx.note}</td>
                    <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDateTime(tx.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Nhập/Xuất */}
      {activeTab === 'Nhập/Xuất' && (
        <div className="space-y-6">
          <div className="glass glass-hover rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-5">So sánh Nhập / Xuất theo ngày</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => typeof v === 'number' ? formatCurrency(v) : ''} />
                <Legend formatter={v => v === 'imports' ? 'Nhập hàng' : 'Xuất hàng'} />
                <Bar dataKey="imports" fill="#3b82f6" radius={[4, 4, 0, 0]} name="imports" />
                <Bar dataKey="exports" fill="#10b981" radius={[4, 4, 0, 0]} name="exports" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Import orders summary */}
            <div className="glass glass-hover rounded-2xl overflow-hidden">
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold text-white">Tóm tắt đơn nhập</h3>
              </div>
              <table className="wh-table">
                <thead><tr><th>Mã đơn</th><th>Nhà cung cấp</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
                <tbody>
                  {MOCK_IMPORT_ORDERS.map(o => (
                    <tr key={o.id}>
                      <td><span className="font-mono text-xs text-blue-400">{o.code}</span></td>
                      <td className="text-sm">{o.supplier?.name}</td>
                      <td className="text-sm">{formatCurrency(o.total_amount)}</td>
                      <td><span className={`badge ${getStatusColor(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Export orders summary */}
            <div className="glass glass-hover rounded-2xl overflow-hidden">
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold text-white">Tóm tắt đơn xuất</h3>
              </div>
              <table className="wh-table">
                <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
                <tbody>
                  {MOCK_EXPORT_ORDERS.map(o => (
                    <tr key={o.id}>
                      <td><span className="font-mono text-xs text-emerald-400">{o.code}</span></td>
                      <td className="text-sm">{o.customer_name}</td>
                      <td className="text-sm">{formatCurrency(o.total_amount)}</td>
                      <td><span className={`badge ${getStatusColor(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
