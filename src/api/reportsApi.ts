import { httpClient, IS_MOCK_ENABLED } from './client';
import { BranchId } from '../types';

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'finance' | 'inventory' | 'party' | 'operations';
}

export interface ReportPreviewResult {
  reportId: string;
  reportName: string;
  dateRange: string;
  branchName: string;
  generatedAt: string;
  headers: string[];
  rows: (string | number)[][];
  summaryTotals?: Record<string, string | number>;
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  { id: 'sales', name: 'Sales Report', description: 'Item-wise sales velocity, department turnover, gross profit margin & tax breakdown.', category: 'sales' },
  { id: 'profit_loss', name: 'Profit & Loss', description: 'Comprehensive P&L statement, revenue, COGS, operating overheads & net margin.', category: 'finance' },
  { id: 'purchases', name: 'Purchase Report', description: 'Procurement bills, vendor invoices, tax credit (ITC) & inbound shipment costs.', category: 'inventory' },
  { id: 'inventory', name: 'Inventory Report', description: 'Current stock on hand, valuation at cost/retail, buffer thresholds & expiry aging.', category: 'inventory' },
  { id: 'stock_movement', name: 'Stock Movement', description: 'Stock inflows, outbound sales, damaged wastage, returns & branch inter-transfers.', category: 'inventory' },
  { id: 'customers', name: 'Customer Report', description: 'Customer purchase histories, loyalty points ledger, khata credit limits & receivables.', category: 'party' },
  { id: 'suppliers', name: 'Supplier Report', description: 'Vendor directory, order fulfillment rates, trade credit terms & open payables.', category: 'party' },
  { id: 'expenses', name: 'Expense Report', description: 'Operating expenses categorised by rent, salary, utilities, maintenance & petty cash.', category: 'finance' },
  { id: 'staff', name: 'Staff Performance', description: 'Cashier shift turnover, billing speed, discount authorizations, voids & cash float balance.', category: 'operations' },
  { id: 'branch', name: 'Branch Performance', description: 'Cross-store sales, footfall, average basket size, gross margin & asset utilization.', category: 'operations' },
  { id: 'payments', name: 'Payment Report', description: 'Tender breakdowns across UPI, physical cash, debit/credit cards, NEFT & store credit.', category: 'finance' },
  { id: 'outstanding', name: 'Outstanding Report', description: 'Aging analysis of customer receivables vs supplier payables with overdue alerts.', category: 'party' },
];

export const reportsApi = {
  getReportDefinitions(): ReportDefinition[] {
    return REPORT_DEFINITIONS;
  },

  async generateReport(reportId: string, params: { dateRange: string; branchId: BranchId }): Promise<ReportPreviewResult> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<ReportPreviewResult>('/api/v1/reports/generate', {
        reportId,
        ...params,
      });
    }

    await new Promise(r => setTimeout(r, 120));
    const def = REPORT_DEFINITIONS.find(r => r.id === reportId) || REPORT_DEFINITIONS[0];
    const branchName = params.branchId === 'all' ? 'All Stores (Consolidated)' : `Store Branch ${params.branchId}`;

    switch (reportId) {
      case 'sales':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Category', 'Items Sold', 'Gross Turnover', 'Discounts', 'Taxable Val', 'GST', 'Net Sales'],
          rows: [
            ['FMCG Groceries', '1,420 pkts', '₹94,500', '₹1,200', '₹88,857', '₹4,443 (5%)', '₹93,300'],
            ['Personal Care', '380 units', '₹34,200', '₹800', '₹28,305', '₹5,095 (18%)', '₹33,400'],
            ['Apparel & Wear', '125 pcs', '₹42,800', '₹1,500', '₹36,875', '₹4,425 (12%)', '₹41,300'],
            ['Packaged Foods', '890 pkts', '₹56,100', '₹600', '₹49,554', '₹5,946 (12%)', '₹55,500'],
            ['Dairy & Chilled', '610 units', '₹28,400', '₹0', '₹27,048', '₹1,352 (5%)', '₹28,400'],
          ],
          summaryTotals: { 'Total Items': '3,425', 'Net Sales': '₹2,51,900', 'Total Tax': '₹21,261' },
        };

      case 'profit_loss':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Revenue & Expense Head', 'Category', 'MTD Amount', 'Percentage of Sales', 'Variance vs Last Month'],
          rows: [
            ['Gross Store Sales', 'Operating Revenue', '₹14,50,000', '100.0%', '+12.4%'],
            ['Cost of Goods Sold (COGS)', 'Direct Cost', '₹11,02,000', '76.0%', '+10.1%'],
            ['Gross Profit Margin', 'Operating Gross', '₹3,48,000', '24.0%', '+20.3%'],
            ['Store Rent & Leases', 'Operating Overhead', '₹55,000', '3.8%', '0.0%'],
            ['Staff Salaries & Bonus', 'Payroll', '₹62,000', '4.3%', '+3.3%'],
            ['Electricity & Power', 'Utilities', '₹14,200', '1.0%', '+5.0%'],
            ['Packaging & Logistics', 'Operations', '₹8,400', '0.6%', '-2.1%'],
            ['Net Operating Profit', 'EBITDA', '₹2,08,400', '14.3%', '+28.5%'],
          ],
          summaryTotals: { 'Net Operating Income': '₹2,08,400', 'EBITDA Margin': '14.3%' },
        };

      case 'purchases':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['PO Number', 'Supplier', 'Items Count', 'Gross Value', 'Tax (ITC)', 'Tender Paid', 'Payable Due'],
          rows: [
            ['PO-2026-001', 'Balaji FMCG Traders', '42 items', '₹45,000', '₹4,200', '₹25,000', '₹20,000'],
            ['PO-2026-002', 'National Staples Depot', '18 items', '₹68,500', '₹3,425', '₹44,500', '₹24,000'],
            ['PO-2026-003', 'Hindustan Fresh & Dairy', '15 items', '₹14,200', '₹710', '₹14,200', '₹0'],
            ['PO-2026-004', 'Sunrise Oil Mills Ltd', '12 items', '₹52,000', '₹2,600', '₹30,000', '₹22,000'],
            ['PO-2026-005', 'Godrej & Jyothy Consumer', '34 items', '₹35,700', '₹5,446', '₹12,300', '₹23,400'],
          ],
          summaryTotals: { 'Total Procurement': '₹2,15,400', 'Claimable ITC': '₹16,381', 'Outstanding Due': '₹89,400' },
        };

      case 'inventory':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Item SKU', 'Product Description', 'Stock On Hand', 'Cost Price', 'Selling Price', 'Total Valuation', 'Status'],
          rows: [
            ['SKU-ATT-001', 'Aashirvaad Shudh Chakki Atta 10kg', '28 Bags', '₹410.00', '₹460.00', '₹11,480', 'Optimal'],
            ['SKU-OIL-002', 'Fortune Sunlite Sunflower Oil 1L', '65 Pouches', '₹132.00', '₹152.00', '₹8,580', 'Optimal'],
            ['SKU-TEA-003', 'Tata Tea Gold Leaf 500g', '8 Pkts', '₹260.00', '₹295.00', '₹2,080', 'LOW STOCK'],
            ['SKU-BAS-004', 'India Gate Classic Basmati 5kg', '42 Bags', '₹520.00', '₹599.00', '₹21,840', 'Optimal'],
            ['SKU-MIL-005', 'Amul Taaza Homogenised Toned Milk 1L', '3 Crates', '₹66.00', '₹74.00', '₹2,376', 'EXPIRING SOON'],
          ],
          summaryTotals: { 'Total SKUs Active': '1,420', 'Total Valuation Cost': '₹18,45,000', 'Low Stock SKUs': '17' },
        };

      case 'stock_movement':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Date', 'SKU / Product', 'Opening', 'Inward (PO)', 'Outward (Sales)', 'Damaged/Wastage', 'Closing Stock'],
          rows: [
            ['2026-10-06', 'Aashirvaad Atta 10kg', '35', '0', '7', '0', '28'],
            ['2026-10-06', 'Fortune Sunflower Oil 1L', '80', '0', '15', '0', '65'],
            ['2026-10-06', 'Tata Tea Gold 500g', '14', '0', '6', '0', '8'],
            ['2026-10-06', 'Amul Butter 500g', '50', '25', '22', '1', '52'],
            ['2026-10-06', 'Surf Excel Easy Wash 1kg', '40', '20', '18', '0', '42'],
          ],
          summaryTotals: { 'Total Outward Quantity': '68 Units', 'Damaged Loss': '₹240' },
        };

      case 'customers':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Customer Name', 'Phone', 'Category', 'Lifetime Billed', 'Bills Count', 'Outstanding Khata', 'Credit Limit'],
          rows: [
            ['Rajesh Sharma', '+91 98201 44521', 'VIP Customer', '₹68,400', '42', '₹4,500', '₹10,000'],
            ['Sunita Kulkarni', '+91 97654 32109', 'Credit Customer', '₹45,200', '28', '₹8,200', '₹15,000'],
            ['Amit Deshmukh', '+91 94220 18456', 'Regular', '₹32,100', '24', '₹0', '₹5,000'],
            ['Pooja Mehta', '+91 98199 87654', 'Credit Customer', '₹52,800', '35', '₹12,400', '₹20,000'],
            ['Vikram Patil', '+91 99200 11223', 'Regular', '₹18,900', '15', '₹1,200', '₹5,000'],
          ],
          summaryTotals: { 'Total Customers': '1,284', 'Total Outstanding Khata': '₹26,300' },
        };

      case 'suppliers':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Supplier Company', 'Key Contact', 'GSTIN', 'Total Purchases', 'Paid Amount', 'Payable Due', 'Payment Terms'],
          rows: [
            ['Balaji FMCG Traders', 'Kishore Kumar', '27AABCB1234F1Z8', '₹1,45,000', '₹1,05,000', '₹40,000', 'Net 15 Days (Overdue)'],
            ['National Staples Depot', 'Hasmukh Bhai', '27AABCN5678G1Z2', '₹2,10,000', '₹1,86,000', '₹24,000', 'Net 30 Days (Due Today)'],
            ['Hindustan Fresh & Dairy', 'Suresh Shinde', '27AABCH9912H1Z5', '₹88,000', '₹88,000', '₹0', 'Cash on Delivery'],
            ['Sunrise Oil Mills Ltd', 'Narendra Patel', '27AABCS3456J1Z9', '₹1,85,000', '₹1,60,000', '₹25,000', 'Net 21 Days'],
          ],
          summaryTotals: { 'Total Payables Due': '₹89,400', 'Overdue Amount': '₹40,000' },
        };

      case 'expenses':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Expense Date', 'Category', 'Description / Reference', 'Payment Mode', 'Added By', 'Status', 'Amount'],
          rows: [
            ['2026-10-06', 'Transport', 'Tempo Delivery Freight - Staples Depot', 'CASH', 'Owner', 'APPROVED', '₹450'],
            ['2026-10-06', 'Maintenance', 'Cooler Display Gas Re-fill & Servicing', 'CASH', 'Owner', 'APPROVED', '₹1,600'],
            ['2026-10-05', 'Electricity', 'MSEDCL Commercial Meter Bill Payment', 'UPI', 'Owner', 'APPROVED', '₹14,200'],
            ['2026-10-04', 'Office', 'Thermal Printer Roll Box & POS Stationery', 'CASH', 'Manager', 'APPROVED', '₹850'],
            ['2026-10-01', 'Rent', 'Store Retail Floor Lease Advance', 'BANK_TRANSFER', 'Owner', 'APPROVED', '₹55,000'],
          ],
          summaryTotals: { 'Total Logged Expenses': '₹72,100', 'Cash Outflow': '₹2,900' },
        };

      case 'staff':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Staff Name', 'Role', 'Status', 'Bills Cut', 'Total Sales', 'Avg Bill Value', 'Discounts Authorized', 'Cash Till'],
          rows: [
            ['Ramesh Pawar', 'Senior Cashier', 'ONLINE', '48 Bills', '₹24,500', '₹510', '₹350', '₹9,800'],
            ['Priya Jadhav', 'Cashier', 'ONLINE', '36 Bills', '₹18,200', '₹505', '₹120', '₹6,400'],
            ['Sunil Gaikwad', 'Inventory Assistant', 'ON SHIFT', '0 Bills', '₹0', '₹0', '₹0', '₹0'],
            ['Anand Shinde', 'Store Manager', 'ONLINE', '12 Bills', '₹5,950', '₹495', '₹0', '₹2,300'],
          ],
          summaryTotals: { 'Total Active Staff': '4', 'Shift Sales Total': '₹48,650', 'Total Bills': '96' },
        };

      case 'branch':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Branch Name', 'Code', 'Today Sales', 'Est. Profit', 'Active Bills', 'Stock Value', 'Staff Active', 'POS Count'],
          rows: [
            ['NEXUS Mart - Main Branch', 'MAIN', '₹48,650', '₹11,676 (24%)', '96 Bills', '₹18,45,000', '4 Staff', '3 POS'],
            ['NEXUS Express - City Center', 'CITY', '₹32,400', '₹7,776 (24%)', '64 Bills', '₹12,20,000', '3 Staff', '2 POS'],
            ['NEXUS Fresh - Market Yard', 'MRKT', '₹27,800', '₹6,672 (24%)', '52 Bills', '₹9,80,000', '2 Staff', '1 POS'],
          ],
          summaryTotals: { 'Consolidated Sales': '₹1,08,850', 'Total Network Profit': '₹26,124', 'Total POS Fleet': '6 POS' },
        };

      case 'payments':
        return {
          reportId,
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Tender Channel', 'Transactions Count', 'Amount Collected', 'Percentage Share', 'Settlement Status'],
          rows: [
            ['UPI (QR Code & Apps)', '54 Txns', '₹21,350', '43.9%', 'Instant Bank Settlement'],
            ['Physical Cash', '38 Txns', '₹18,500', '38.0%', 'Verified in Till Float'],
            ['Credit/Debit Cards', '14 Txns', '₹7,800', '16.0%', 'T+1 EDC Settlement'],
            ['Store Khata Credit', '4 Txns', '₹1,000', '2.1%', 'Receivable in Customer Khata'],
            ['Other / Cheque', '0 Txns', '₹0', '0.0%', 'Cleared'],
          ],
          summaryTotals: { 'Total Collected': '₹48,650', 'Net Verified': '₹47,650' },
        };

      case 'outstanding':
      default:
        return {
          reportId: 'outstanding',
          reportName: def.name,
          dateRange: params.dateRange,
          branchName,
          generatedAt: new Date().toLocaleString('en-IN'),
          headers: ['Party Name', 'Party Type', 'Contact', 'Terms', 'Aging Days', 'Overdue Amount', 'Total Outstanding'],
          rows: [
            ['Sunita Kulkarni', 'Customer (Khata)', '+91 97654 32109', '15 Days Credit', '22 Days', '₹3,200', '₹8,200'],
            ['Pooja Mehta', 'Customer (Khata)', '+91 98199 87654', '30 Days Credit', '34 Days', '₹4,400', '₹12,400'],
            ['Balaji FMCG Traders', 'Wholesale Supplier', '+91 98200 44556', 'Net 15 Days', '28 Days', '₹40,000', '₹40,000'],
            ['National Staples Depot', 'Wholesale Supplier', '+91 98211 77889', 'Net 30 Days', '30 Days', '₹24,000', '₹24,000'],
          ],
          summaryTotals: { 'Total Receivables (Khata)': '₹20,600', 'Total Payables (Vendors)': '₹64,000' },
        };
    }
  },
};
