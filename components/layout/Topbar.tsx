'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Quản lý Sản phẩm',
  '/import-orders': 'Nhập hàng',
  '/export-orders': 'Xuất hàng',
  '/reports': 'Báo cáo',
  '/categories': 'Danh mục Sản phẩm',
  '/suppliers': 'Nhà cung cấp',
  '/warehouses': 'Kho lưu trữ',
  '/users': 'Tài khoản',
}

interface TopbarProps {
  onMenuClick?: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuthStore()
  const pathname = usePathname()

  const title = PAGE_TITLES[pathname] ?? 'WarehouseGo'

  return (
    <>
      <style>{`
        .wh-topbar {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(9,14,28,0.9);
          backdrop-filter: blur(12px);
          flex-shrink: 0;
          gap: 12px;
        }

        .wh-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .wh-menu-btn {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .wh-menu-btn:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }
        @media (max-width: 767px) { .wh-menu-btn { display: flex; } }

        .wh-topbar-title {
          font-size: 15px;
          font-weight: 700;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wh-topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .wh-search {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          color: #475569;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
          width: 200px;
        }
        .wh-search:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }
        @media (min-width: 768px) { .wh-search { display: flex; } }

        .wh-search-kbd {
          margin-left: auto;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 4px;
          background: rgba(255,255,255,0.08);
          color: #334155;
        }

        .wh-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          color: #94a3b8;
          cursor: pointer;
          position: relative;
          transition: all 0.15s;
        }
        .wh-icon-btn:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }

        .wh-notif-dot {
          position: absolute; top: 7px; right: 7px;
          width: 6px; height: 6px; border-radius: 50%;
          background: #3b82f6;
          border: 1.5px solid #090e1c;
        }

        .wh-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: white;
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.1);
          transition: border-color 0.15s;
        }
        .wh-avatar:hover { border-color: rgba(99,102,241,0.5); }
      `}</style>

      <header className="wh-topbar">
        <div className="wh-topbar-left">
          <button className="wh-menu-btn" onClick={onMenuClick} aria-label="Mở menu">
            <Menu size={18} />
          </button>
          <h1 className="wh-topbar-title">{title}</h1>
        </div>

        <div className="wh-topbar-right">
          <div className="wh-search">
            <Search size={13} />
            <span>Tìm kiếm...</span>
            <span className="wh-search-kbd">⌘K</span>
          </div>

          <button className="wh-icon-btn" aria-label="Thông báo">
            <Bell size={15} />
            <span className="wh-notif-dot" />
          </button>

          <div className="wh-avatar" title={user?.name}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>
    </>
  )
}
