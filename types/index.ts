// Type definitions for WarehouseGo

export type UserRole = 'admin' | 'staff'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface Category {
  id: number
  name: string
  description: string
}

export interface Supplier {
  id: number
  name: string
  phone: string
  email: string
  address: string
}

export interface Product {
  id: number
  sku: string
  name: string
  category_id: number
  category?: Category
  supplier_id: number
  supplier?: Supplier
  unit: string
  cost_price: number
  sell_price: number
  min_stock: number
  created_at: string
  updated_at: string
  inventory?: InventoryItem[]
  total_quantity?: number
}

export interface Warehouse {
  id: number
  name: string
  location: string
}

export interface InventoryItem {
  id: number
  product_id: number
  product?: Product
  warehouse_id: number
  warehouse?: Warehouse
  quantity: number
  updated_at: string
}

export type OrderStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled'

export interface ImportOrderItem {
  id?: number
  order_id?: number
  product_id: number
  product?: Product
  quantity: number
  unit_price: number
}

export interface ImportOrder {
  id: number
  code: string
  supplier_id: number
  supplier?: Supplier
  user_id: number
  user?: User
  status: OrderStatus
  total_amount: number
  note: string
  created_at: string
  items?: ImportOrderItem[]
}

export interface ExportOrderItem {
  id?: number
  order_id?: number
  product_id: number
  product?: Product
  quantity: number
  unit_price: number
}

export interface ExportOrder {
  id: number
  code: string
  customer_name: string
  user_id: number
  user?: User
  status: OrderStatus
  total_amount: number
  note: string
  created_at: string
  items?: ExportOrderItem[]
}

export interface InventoryTransaction {
  id: number
  product_id: number
  product?: Product
  warehouse_id: number
  warehouse?: Warehouse
  type: 'import' | 'export' | 'adjust'
  quantity_change: number
  note: string
  reference_id: number
  created_by: number
  created_by_user?: User
  created_at: string
}

export interface DashboardStats {
  total_products: number
  today_imports: number
  today_exports: number
  today_revenue: number
  low_stock_count: number
  total_inventory_value: number
}

export interface ChartDataPoint {
  date: string
  imports: number
  exports: number
  revenue: number
}

export interface LowStockProduct {
  product: Product
  current_quantity: number
  min_stock: number
}

// API Response
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}
