'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Package, TrendingDown, TrendingUp, AlertTriangle,
  DollarSign, BarChart2, ArrowUp, ArrowDown, Clock, Boxes,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts'
import {
  MOCK_DASHBOARD_STATS, MOCK_CHART_DATA, MOCK_LOW_STOCK,
  MOCK_TRANSACTIONS, MOCK_IMPORT_ORDERS, MOCK_EXPORT_ORDERS,
} from '@/lib/mock-data'
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

const statCards = [
  {
    label: 'Tổng sản phẩm',
    value: '8 SP',
    icon: Package,
    color: 'card-gradient-blue',
    iconBg: 'rgba(59,130,246,0.15)',
    iconColor: '#60a5fa',
    change: '+2',
    positive: true,
  },
  {
    label: 'Nhập hôm nay',
    value: '3 đơn',
    icon: TrendingDown,
    color: 'card-gradient-emerald',
    iconBg: 'rgba(16,185,129,0.15)',
    iconColor: '#34d399',
    change: '+1',
    positive: true,
  },
  {
    label: 'Xuất hôm nay',
    value: '2 đơn',
    icon: TrendingUp,
    color: 'card-gradient-amber',
    iconBg: 'rgba(245,158,11,0.15)',
    iconColor: '#fbbf24',
    change: '-1',
    positive: false,
  },
  {
    label: 'Doanh thu hôm nay',
    value: formatCurrency(MOCK_DASHBOARD_STATS.today_revenue),
    icon: DollarSign,
    color: 'card-gradient-indigo',
    iconBg: 'rgba(99,102,241,0.15)',
    iconColor: '#a5b4fc',
    change: '+18%',
    positive: true,
  },
  {
    label: 'SP sắp hết hàng',
    value: '4 SP',
    icon: AlertTriangle,
    color: 'card-gradient-rose',
    iconBg: 'rgba(244,63,94,0.15)',
    iconColor: '#f87171',
    change: '!',
    positive: false,
  },
  {
    label: 'Giá trị tồn kho',
    value: formatCurrency(MOCK_DASHBOARD_STATS.total_inventory_value),
    icon: Boxes,
    color: 'card-gradient-violet',
    iconBg: 'rgba(139,92,246,0.15)',
    iconColor: '#c4b5fd',
    change: '+5%',
    positive: true,
  },
]

const chartTooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#f1f5f9',
  fontSize: '12px',
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Xin chào, <strong>{user?.name}</strong>! Đây là tổng quan hôm nay.</p>
        </div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`stat-card glass glass-hover ${card.color}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>
                  <Icon size={18} style={{ color: card.iconColor }} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${card.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {card.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {card.change}
                </span>
              </div>
              <div className="text-xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Area chart - takes 2/3 width */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Biểu đồ Nhập / Xuất trong tuần</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Tuần hiện tại</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-primary">Tuần</button>
              <button className="btn btn-sm btn-secondary">Tháng</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorImport" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => typeof v === 'number' ? formatCurrency(v) : ''} />
              <Legend formatter={(v) => v === 'imports' ? 'Nhập hàng' : 'Xuất hàng'} />
              <Area type="monotone" dataKey="imports" stroke="#3b82f6" strokeWidth={2} fill="url(#colorImport)" />
              <Area type="monotone" dataKey="exports" stroke="#10b981" strokeWidth={2} fill="url(#colorExport)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Low stock panel - takes 1/3 */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,63,94,0.15)' }}>
              <AlertTriangle size={15} style={{ color: '#f87171' }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Sắp hết hàng</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{MOCK_LOW_STOCK.length} sản phẩm</p>
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_LOW_STOCK.map((item) => {
              const pct = Math.min(100, (item.current_quantity / item.min_stock) * 100)
              return (
                <div key={item.product.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }} className="truncate max-w-[140px]">{item.product.name}</span>
                    <span style={{ color: '#f87171' }}>{item.current_quantity}/{item.min_stock}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: pct < 30 ? '#f43f5e' : '#f59e0b' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <a href="/reports" className="btn btn-secondary btn-sm w-full mt-5 text-center">Xem báo cáo tồn kho</a>
        </div>
      </div>

      {/* Bar chart + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Bar chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-1">Doanh thu theo ngày</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Đơn vị: triệu VND</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => typeof v === 'number' ? formatCurrency(v) : ''} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Giao dịch gần đây</h2>
            <a href="/reports" className="text-xs" style={{ color: '#60a5fa' }}>Xem tất cả →</a>
          </div>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tx.type === 'import' ? '' : ''}`} style={{ background: tx.type === 'import' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)' }}>
                  {tx.type === 'import' ? (
                    <TrendingDown size={14} style={{ color: '#60a5fa' }} />
                  ) : (
                    <TrendingUp size={14} style={{ color: '#34d399' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{tx.product?.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tx.note}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${tx.quantity_change > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {tx.quantity_change > 0 ? '+' : ''}{tx.quantity_change}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tx.product?.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-semibold text-white">Đơn hàng gần đây</h2>
          <div className="flex gap-2">
            <a href="/import-orders" className="btn btn-sm btn-secondary">Nhập hàng</a>
            <a href="/export-orders" className="btn btn-sm btn-secondary">Xuất hàng</a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="wh-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Loại</th>
                <th>Đối tác</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...MOCK_IMPORT_ORDERS.map(o => ({ ...o, type: 'Nhập hàng', partner: o.supplier?.name })),
                ...MOCK_EXPORT_ORDERS.map(o => ({ ...o, type: 'Xuất hàng', partner: o.customer_name })),
              ]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 6)
                .map((order) => (
                  <tr key={`${order.type}-${order.id}`}>
                    <td>
                      <span className="font-mono text-sm font-medium" style={{ color: '#60a5fa' }}>{order.code}</span>
                    </td>
                    <td>
                      <span className="text-sm" style={{ color: order.type === 'Nhập hàng' ? '#60a5fa' : '#34d399' }}>{order.type}</span>
                    </td>
                    <td className="text-sm">{order.partner}</td>
                    <td className="text-sm font-medium">{formatCurrency(order.total_amount)}</td>
                    <td>
                      <span className={`badge ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                    </td>
                    <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(order.created_at)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
