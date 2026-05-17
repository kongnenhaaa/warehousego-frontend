// Mock data for UI demo — replace with real API calls via axios

import {
  Product, Category, Supplier, ImportOrder, ExportOrder,
  InventoryTransaction, DashboardStats, ChartDataPoint, LowStockProduct, Warehouse, User,
} from '@/types'

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Điện tử', description: 'Thiết bị điện tử, linh kiện' },
  { id: 2, name: 'Văn phòng phẩm', description: 'Dụng cụ văn phòng' },
  { id: 3, name: 'Thực phẩm', description: 'Thực phẩm & đồ uống' },
  { id: 4, name: 'Thời trang', description: 'Quần áo, phụ kiện' },
  { id: 5, name: 'Gia dụng', description: 'Đồ dùng gia đình' },
]

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Công ty TNHH TechViet', phone: '0901234567', email: 'contact@techviet.vn', address: '123 Nguyễn Văn Cừ, Q5, TP.HCM' },
  { id: 2, name: 'Nhà cung cấp ABC', phone: '0912345678', email: 'abc@supplier.com', address: '456 Lý Thường Kiệt, Q10, TP.HCM' },
  { id: 3, name: 'Global Import Co.', phone: '0923456789', email: 'info@globalimport.com', address: '789 Điện Biên Phủ, Bình Thạnh, TP.HCM' },
]

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 1, name: 'Kho A - Tầng 1', location: 'Quận 9, TP.HCM' },
  { id: 2, name: 'Kho B - Tầng 2', location: 'Quận 9, TP.HCM' },
  { id: 3, name: 'Kho C - Bình Dương', location: 'Thuận An, Bình Dương' },
]

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, sku: 'SPH-001', name: 'iPhone 15 Pro Max', category_id: 1, category: MOCK_CATEGORIES[0],
    supplier_id: 1, supplier: MOCK_SUPPLIERS[0], unit: 'Cái', cost_price: 25000000, sell_price: 28000000,
    min_stock: 5, total_quantity: 24, created_at: '2024-01-10T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2, sku: 'LTP-002', name: 'MacBook Pro 14 inch', category_id: 1, category: MOCK_CATEGORIES[0],
    supplier_id: 1, supplier: MOCK_SUPPLIERS[0], unit: 'Cái', cost_price: 42000000, sell_price: 46000000,
    min_stock: 3, total_quantity: 8, created_at: '2024-01-11T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 3, sku: 'HDN-003', name: 'Tai nghe Sony WH-1000XM5', category_id: 1, category: MOCK_CATEGORIES[0],
    supplier_id: 2, supplier: MOCK_SUPPLIERS[1], unit: 'Cái', cost_price: 6500000, sell_price: 7500000,
    min_stock: 10, total_quantity: 3, created_at: '2024-01-12T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 4, sku: 'VPP-004', name: 'Bút bi Thiên Long', category_id: 2, category: MOCK_CATEGORIES[1],
    supplier_id: 2, supplier: MOCK_SUPPLIERS[1], unit: 'Hộp', cost_price: 25000, sell_price: 35000,
    min_stock: 50, total_quantity: 4, created_at: '2024-01-13T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 5, sku: 'TN-005', name: 'Nước suối Aquafina 500ml', category_id: 3, category: MOCK_CATEGORIES[2],
    supplier_id: 3, supplier: MOCK_SUPPLIERS[2], unit: 'Thùng', cost_price: 60000, sell_price: 85000,
    min_stock: 30, total_quantity: 150, created_at: '2024-01-14T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 6, sku: 'GD-006', name: 'Nồi cơm điện Sunhouse 1.8L', category_id: 5, category: MOCK_CATEGORIES[4],
    supplier_id: 3, supplier: MOCK_SUPPLIERS[2], unit: 'Cái', cost_price: 450000, sell_price: 590000,
    min_stock: 15, total_quantity: 7, created_at: '2024-01-14T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 7, sku: 'TT-007', name: 'Áo phông nam basic', category_id: 4, category: MOCK_CATEGORIES[3],
    supplier_id: 1, supplier: MOCK_SUPPLIERS[0], unit: 'Cái', cost_price: 120000, sell_price: 199000,
    min_stock: 20, total_quantity: 85, created_at: '2024-01-14T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 8, sku: 'MNH-008', name: 'Màn hình Samsung 27 inch', category_id: 1, category: MOCK_CATEGORIES[0],
    supplier_id: 2, supplier: MOCK_SUPPLIERS[1], unit: 'Cái', cost_price: 4800000, sell_price: 5500000,
    min_stock: 5, total_quantity: 2, created_at: '2024-01-15T08:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
]

export const MOCK_IMPORT_ORDERS: ImportOrder[] = [
  {
    id: 1, code: 'NK-2024-001', supplier_id: 1, supplier: MOCK_SUPPLIERS[0],
    user_id: 1, status: 'completed', total_amount: 150000000, note: 'Nhập hàng đầu tháng 1',
    created_at: '2024-01-10T09:00:00Z',
    items: [
      { id: 1, order_id: 1, product_id: 1, product: MOCK_PRODUCTS[0], quantity: 5, unit_price: 25000000 },
      { id: 2, order_id: 1, product_id: 2, product: MOCK_PRODUCTS[1], quantity: 2, unit_price: 42000000 },
    ],
  },
  {
    id: 2, code: 'NK-2024-002', supplier_id: 2, supplier: MOCK_SUPPLIERS[1],
    user_id: 2, status: 'confirmed', total_amount: 22500000, note: 'Nhập tai nghe và bút',
    created_at: '2024-01-13T14:00:00Z',
    items: [
      { id: 3, order_id: 2, product_id: 3, product: MOCK_PRODUCTS[2], quantity: 3, unit_price: 6500000 },
      { id: 4, order_id: 2, product_id: 4, product: MOCK_PRODUCTS[3], quantity: 100, unit_price: 25000 },
    ],
  },
  {
    id: 3, code: 'NK-2024-003', supplier_id: 3, supplier: MOCK_SUPPLIERS[2],
    user_id: 1, status: 'draft', total_amount: 18000000, note: 'Đang chờ xác nhận',
    created_at: '2024-01-15T10:00:00Z',
    items: [],
  },
]

export const MOCK_EXPORT_ORDERS: ExportOrder[] = [
  {
    id: 1, code: 'XK-2024-001', customer_name: 'Công ty Hoàng Long',
    user_id: 2, status: 'completed', total_amount: 56000000, note: 'Xuất cho khách VIP',
    created_at: '2024-01-11T11:00:00Z',
    items: [
      { id: 1, order_id: 1, product_id: 1, product: MOCK_PRODUCTS[0], quantity: 2, unit_price: 28000000 },
    ],
  },
  {
    id: 2, code: 'XK-2024-002', customer_name: 'Nguyễn Thị Bình',
    user_id: 2, status: 'confirmed', total_amount: 46000000, note: '',
    created_at: '2024-01-14T09:00:00Z',
    items: [
      { id: 2, order_id: 2, product_id: 2, product: MOCK_PRODUCTS[1], quantity: 1, unit_price: 46000000 },
    ],
  },
  {
    id: 3, code: 'XK-2024-003', customer_name: 'Trần Văn Minh',
    user_id: 1, status: 'draft', total_amount: 0, note: 'Đang soạn',
    created_at: '2024-01-15T15:00:00Z',
    items: [],
  },
]

export const MOCK_TRANSACTIONS: InventoryTransaction[] = [
  { id: 1, product_id: 1, product: MOCK_PRODUCTS[0], warehouse_id: 1, type: 'import', quantity_change: 5, note: 'Nhập kho NK-2024-001', reference_id: 1, created_by: 1, created_at: '2024-01-10T09:30:00Z' },
  { id: 2, product_id: 2, product: MOCK_PRODUCTS[1], warehouse_id: 1, type: 'import', quantity_change: 2, note: 'Nhập kho NK-2024-001', reference_id: 1, created_by: 1, created_at: '2024-01-10T09:31:00Z' },
  { id: 3, product_id: 1, product: MOCK_PRODUCTS[0], warehouse_id: 1, type: 'export', quantity_change: -2, note: 'Xuất kho XK-2024-001', reference_id: 1, created_by: 2, created_at: '2024-01-11T11:30:00Z' },
  { id: 4, product_id: 3, product: MOCK_PRODUCTS[2], warehouse_id: 2, type: 'import', quantity_change: 3, note: 'Nhập kho NK-2024-002', reference_id: 2, created_by: 2, created_at: '2024-01-13T14:30:00Z' },
  { id: 5, product_id: 2, product: MOCK_PRODUCTS[1], warehouse_id: 1, type: 'export', quantity_change: -1, note: 'Xuất kho XK-2024-002', reference_id: 2, created_by: 2, created_at: '2024-01-14T09:30:00Z' },
]

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_products: 8,
  today_imports: 3,
  today_exports: 2,
  today_revenue: 112000000,
  low_stock_count: 4,
  total_inventory_value: 980000000,
}

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { date: 'T2', imports: 45000000, exports: 32000000, revenue: 12000000 },
  { date: 'T3', imports: 82000000, exports: 56000000, revenue: 18000000 },
  { date: 'T4', imports: 38000000, exports: 71000000, revenue: 25000000 },
  { date: 'T5', imports: 95000000, exports: 48000000, revenue: 15000000 },
  { date: 'T6', imports: 67000000, exports: 89000000, revenue: 32000000 },
  { date: 'T7', imports: 120000000, exports: 65000000, revenue: 19000000 },
  { date: 'CN', imports: 55000000, exports: 78000000, revenue: 28000000 },
]

export const MOCK_LOW_STOCK: LowStockProduct[] = [
  { product: MOCK_PRODUCTS[2], current_quantity: 3, min_stock: 10 },
  { product: MOCK_PRODUCTS[3], current_quantity: 4, min_stock: 50 },
  { product: MOCK_PRODUCTS[5], current_quantity: 7, min_stock: 15 },
  { product: MOCK_PRODUCTS[7], current_quantity: 2, min_stock: 5 },
]

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@warehouse.com', role: 'admin', created_at: '2024-01-01T08:00:00Z' },
  { id: 2, name: 'Nguyễn Văn A', email: 'staff@warehouse.com', role: 'staff', created_at: '2024-01-05T08:00:00Z' },
  { id: 3, name: 'Trần Thị B', email: 'tranb@warehouse.com', role: 'staff', created_at: '2024-01-08T08:00:00Z' },
]
