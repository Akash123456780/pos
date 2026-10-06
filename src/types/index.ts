export type BranchId = 'all' | 'branch_1' | 'branch_2' | 'branch_3';

export interface Branch {
  id: BranchId;
  name: string;
  shortCode: string;
  address: string;
  city: string;
  manager: string;
  phone: string;
  posCount: number;
  staffCount: number;
  todaySales: number;
  todayProfit: number;
  todayBills: number;
  stockValue: number;
  status: 'active' | 'busy' | 'offline';
}

export type PaymentMode = 'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'SPLIT';

export type BillStatus = 'PAID' | 'CREDIT' | 'PARTIAL' | 'CANCELLED' | 'RETURNED';

export interface BillItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  branchId: BranchId;
  branchName: string;
  date: string;
  time: string;
  timestamp: number;
  customerId?: string;
  customerName: string;
  customerMobile: string;
  cashierId: string;
  cashierName: string;
  posDeviceId: string;
  posDeviceName: string;
  items: BillItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grandTotal: number;
  paymentMode: PaymentMode;
  paymentDetails: {
    cashAmount?: number;
    upiRef?: string;
    upiAmount?: number;
    cardLast4?: string;
    cardAmount?: number;
    creditAmount?: number;
  };
  status: BillStatus;
  notes?: string;
}

export type ProductCategory = 
  | 'Grocery & Staples'
  | 'Edible Oils & Ghee'
  | 'Snacks & Biscuits'
  | 'Beverages & Dairy'
  | 'Personal Care & Hygiene'
  | 'Household & Cleaning'
  | 'Apparel & Clothing'
  | 'Consumer Electronics'
  | 'Pharmacy & Wellness'
  | 'Stationery';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: ProductCategory;
  brand: string;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  mrp: number;
  marginPercent: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  supplierId: string;
  supplierName: string;
  branchStock: Record<string, number>;
  batchNumber?: string;
  mfgDate?: string;
  expiryDate?: string;
  shelfLifeDays?: number;
  industryAttributes?: {
    type: 'grocery' | 'clothing' | 'electronics' | 'pharmacy';
    // Clothing
    size?: string;
    color?: string;
    fabric?: string;
    gender?: 'Men' | 'Women' | 'Kids' | 'Unisex';
    fit?: string;
    // Grocery
    weightVolume?: string;
    storageType?: 'Ambient' | 'Refrigerated' | 'Cool & Dry';
    // Electronics
    imeiSerial?: string;
    warrantyMonths?: number;
    // Pharmacy
    dosageForm?: string;
    scheduleCategory?: 'Schedule H' | 'OTC' | 'General';
  };
  fastMoving: boolean;
  stockHistory: { date: string; change: number; type: 'sale' | 'purchase' | 'adjustment'; balance: number }[];
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  category: string;
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRY_SOON' | 'EXPIRED' | 'NEGATIVE_STOCK';
  currentStock: number;
  requiredStock: number;
  supplierName: string;
  expiryDate?: string;
  daysToExpiry?: number;
  branchName: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  segment: 'VIP' | 'Regular' | 'New' | 'Credit Customer';
  totalPurchases: number;
  totalOrders: number;
  outstandingBalance: number;
  creditLimit: number;
  creditDueDays: number;
  isOverdue: boolean;
  loyaltyPoints: number;
  lastPurchaseDate: string;
  joinedDate: string;
  ledgerEntries: {
    id: string;
    date: string;
    type: 'INVOICE' | 'PAYMENT' | 'RETURN';
    refNumber: string;
    debit: number;
    credit: number;
    balance: number;
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  mobile: string;
  email: string;
  gstin: string;
  address: string;
  category: string;
  totalPurchases: number;
  outstandingPayables: number;
  dueToday: number;
  isOverdue: boolean;
  paymentTerms: string;
  lastPurchaseDate: string;
  ledgerEntries: {
    id: string;
    date: string;
    invoiceNo: string;
    type: 'BILL' | 'PAYMENT';
    debit: number;
    credit: number;
    balance: number;
  }[];
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  branchId: BranchId;
  branchName: string;
  date: string;
  itemsCount: number;
  items: {
    productName: string;
    qty: number;
    unit: string;
    purchaseRate: number;
    taxRate: number;
    total: number;
  }[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING';
}

export type StaffRole = 'Owner' | 'Admin' | 'Manager' | 'Cashier';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  branchId: BranchId;
  branchName: string;
  mobile: string;
  email: string;
  avatarUrl?: string;
  status: 'ONLINE' | 'ON_BREAK' | 'OFFLINE';
  currentShift: string;
  shiftStartTime: string;
  todaySales: number;
  todayBillsCount: number;
  todayDiscounts: number;
  todayReturns: number;
  cashCollection: number;
  upiCollection: number;
  posTerminalAssigned: string;
  lastActive: string;
}

export interface StaffAuditLog {
  id: string;
  timestamp: string;
  timeAgo: string;
  staffId: string;
  staffName: string;
  role: StaffRole;
  branchName: string;
  action: 
    | 'LOGIN'
    | 'LOGOUT'
    | 'BILL_CREATED'
    | 'BILL_CANCELLED'
    | 'DISCOUNT_APPLIED'
    | 'RETURN_PROCESSED'
    | 'STOCK_ADJUSTMENT'
    | 'EXPENSE_ADDED'
    | 'DRAWER_OPENED';
  details: string;
  amount?: number;
  severity: 'normal' | 'flagged' | 'critical';
}

export type ExpenseCategory = 
  | 'Rent'
  | 'Salary'
  | 'Electricity'
  | 'Transport'
  | 'Maintenance'
  | 'Marketing'
  | 'Office'
  | 'Other';

export interface Expense {
  id: string;
  branchId: BranchId;
  branchName: string;
  date: string;
  time: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  addedBy: string;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  status: 'APPROVED' | 'PENDING';
  receiptAttached: boolean;
}

export interface PosDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  branchId: BranchId;
  branchName: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'SYNCING';
  currentCashier: string;
  appVersion: string;
  os: string;
  ipAddress: string;
  lastActiveTime: string;
  lastSyncTime: string;
  lastBackupTime: string;
  pendingSyncBills: number;
  printerStatus: 'Connected' | 'Disconnected' | 'Out of Paper';
  scannerStatus: 'Connected' | 'Disconnected';
}

export type NotificationType = 
  | 'LOW_STOCK'
  | 'EXPIRY'
  | 'SALES'
  | 'PAYMENT'
  | 'STAFF'
  | 'SECURITY'
  | 'SYSTEM'
  | 'BACKUP'
  | 'SYNC'
  | 'POS_OFFLINE';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'info';
  branchName?: string;
  actionUrl?: string;
}

export interface BusinessHealthMetric {
  category: 'Sales' | 'Profit' | 'Inventory' | 'Customer' | 'Staff' | 'Cash Flow';
  score: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  highlights: string[];
  recommendations: string[];
}

export interface KpiMetric {
  value: number;
  formattedValue: string;
  prevValue: number;
  diffPercent: number;
  isPositive: boolean;
}

export interface DashboardMetrics {
  todaySales: KpiMetric;
  todayProfit: KpiMetric;
  todayBills: KpiMetric;
  todayExpenses: KpiMetric;
  cashCollection: number;
  upiCollection: number;
  cardCollection: number;
  creditSales: number;
  outstandingReceivables: number;
  supplierPayables: number;
  stockValue: number;
  lowStockCount: number;
  expiringCount: number;
  expectedCashInDrawer: number;
  actualCashReported: number;
  cashDiscrepancy: number;
}
