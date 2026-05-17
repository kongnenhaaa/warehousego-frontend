'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import {
  LayoutDashboard,
  Package,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Tag,
  Truck,
  Warehouse,
  Users,
  LogOut,
  Boxes,
  ChevronRight,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavGroup {
  label: string
  items: NavItem[]
}

interface NavItem {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  label: string
  adminOnly?: boolean
}

const navGroups: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Nghiệp vụ',
    items: [
      { href: '/products', icon: Package, label: 'Sản phẩm' },
      { href: '/import-orders', icon: TrendingDown, label: 'Nhập hàng' },
      { href: '/export-orders', icon: TrendingUp, label: 'Xuất hàng' },
      { href: '/reports', icon: BarChart3, label: 'Báo cáo' },
    ],
  },
  {
    label: 'Danh mục (Admin)',
    items: [
      { href: '/categories', icon: Tag, label: 'Danh mục SP', adminOnly: true },
      { href: '/suppliers', icon: Truck, label: 'Nhà cung cấp', adminOnly: true },
      { href: '/warehouses', icon: Warehouse, label: 'Kho lưu trữ', adminOnly: true },
      { href: '/users', icon: Users, label: 'Tài khoản', adminOnly: true },
    ],
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  return (
    <>
      <style>{`
        .wh-sidebar {
          width: 256px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(180deg, #0a0f1e 0%, #0d1526 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow-y: auto;
          position: relative;
          z-index: 41;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Desktop: always visible */
        @media (min-width: 768px) {
          .wh-sidebar {
            position: relative !important;
            transform: none !important;
          }
        }

        /* Mobile: slide in/out */
        @media (max-width: 767px) {
          .wh-sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
          }
          .wh-sidebar.open {
            transform: translateX(0);
            box-shadow: 8px 0 32px rgba(0,0,0,0.5);
          }
        }

        .wh-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 20px 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .wh-sidebar-logo-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .wh-sidebar-close {
          margin-left: auto;
          background: none; border: none; cursor: pointer;
          color: #475569; padding: 4px;
          display: none;
        }
        @media (max-width: 767px) {
          .wh-sidebar-close { display: flex; align-items: center; }
        }
        .wh-sidebar-close:hover { color: #94a3b8; }

        .wh-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .wh-nav-group {
          margin-bottom: 24px;
        }

        .wh-nav-group-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #334155;
          padding: 0 10px;
          margin-bottom: 6px;
        }

        .wh-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.18s ease;
          margin-bottom: 2px;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .wh-nav-item:hover {
          background: rgba(59,130,246,0.08);
          color: #cbd5e1;
          border-color: rgba(59,130,246,0.1);
        }

        .wh-nav-item.active {
          background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.12));
          color: #60a5fa;
          border-color: rgba(59,130,246,0.2);
          font-weight: 600;
        }

        .wh-nav-chevron {
          margin-left: auto;
          opacity: 0.7;
        }

        .wh-sidebar-user {
          padding: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .wh-user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .wh-user-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: white;
          flex-shrink: 0;
        }

        .wh-logout-btn {
          margin-left: auto;
          background: none; border: none; cursor: pointer;
          color: #475569; padding: 6px;
          border-radius: 8px;
          transition: all 0.15s;
          display: flex; align-items: center;
        }
        .wh-logout-btn:hover {
          background: rgba(244,63,94,0.1);
          color: #f87171;
        }
      `}</style>

      <aside className={cn('wh-sidebar', isOpen && 'open')}>
        {/* Logo */}
        <div className="wh-sidebar-logo">
          <div className="wh-sidebar-logo-icon">
            <Boxes size={18} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>WarehouseGo</div>
            <div style={{ fontSize: 11, color: '#475569' }}>Quản lý kho hàng</div>
          </div>
          <button className="wh-sidebar-close" onClick={onClose} aria-label="Đóng sidebar">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="wh-nav">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin)
            if (visibleItems.length === 0) return null
            return (
              <div key={group.label} className="wh-nav-group">
                <div className="wh-nav-group-label">{group.label}</div>
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn('wh-nav-item', isActive && 'active')}
                      onClick={onClose}
                    >
                      <Icon size={16} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {isActive && <ChevronRight size={13} className="wh-nav-chevron" />}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* User */}
        <div className="wh-sidebar-user">
          <div className="wh-user-card">
            <div className="wh-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: '#475569' }}>
                {user?.role === 'admin' ? '👑 Admin' : '👤 Staff'}
              </div>
            </div>
            <button
              className="wh-logout-btn"
              onClick={logout}
              title="Đăng xuất"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
