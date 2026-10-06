import { httpClient, IS_MOCK_ENABLED } from './client';
import { BranchId, DashboardMetrics } from '../types';
import { MOCK_DASHBOARD_METRICS, MOCK_BRANCHES, MOCK_HOURLY_SALES, MOCK_DAILY_SALES_7D } from '../data/mockData';

export const dashboardApi = {
  async getDashboardMetrics(branchId: BranchId = 'all'): Promise<DashboardMetrics> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<DashboardMetrics>('/api/v1/dashboard/metrics', {
        params: { branchId: branchId === 'all' ? undefined : branchId },
      });
    }

    // Mock Mode
    await new Promise(r => setTimeout(r, 60));
    if (branchId === 'all') {
      return MOCK_DASHBOARD_METRICS;
    }
    const branch = MOCK_BRANCHES.find(b => b.id === branchId);
    if (!branch) return MOCK_DASHBOARD_METRICS;

    const ratio = branch.todaySales / MOCK_DASHBOARD_METRICS.todaySales.value;
    return {
      todaySales: {
        value: branch.todaySales,
        formattedValue: `₹${branch.todaySales.toLocaleString('en-IN')}`,
        prevValue: Math.round(branch.todaySales * 0.9),
        diffPercent: 11.2,
        isPositive: true,
      },
      todayProfit: {
        value: branch.todayProfit,
        formattedValue: `₹${branch.todayProfit.toLocaleString('en-IN')}`,
        prevValue: Math.round(branch.todayProfit * 0.92),
        diffPercent: 8.7,
        isPositive: true,
      },
      todayBills: {
        value: branch.todayBills,
        formattedValue: `${branch.todayBills}`,
        prevValue: Math.round(branch.todayBills * 0.88),
        diffPercent: 13.6,
        isPositive: true,
      },
      todayExpenses: {
        value: Math.round(MOCK_DASHBOARD_METRICS.todayExpenses.value * ratio),
        formattedValue: `₹${Math.round(MOCK_DASHBOARD_METRICS.todayExpenses.value * ratio).toLocaleString('en-IN')}`,
        prevValue: Math.round(MOCK_DASHBOARD_METRICS.todayExpenses.value * ratio * 1.05),
        diffPercent: -4.8,
        isPositive: true,
      },
      cashCollection: Math.round(MOCK_DASHBOARD_METRICS.cashCollection * ratio),
      upiCollection: Math.round(MOCK_DASHBOARD_METRICS.upiCollection * ratio),
      cardCollection: Math.round(MOCK_DASHBOARD_METRICS.cardCollection * ratio),
      creditSales: Math.round(MOCK_DASHBOARD_METRICS.creditSales * ratio),
      outstandingReceivables: Math.round(MOCK_DASHBOARD_METRICS.outstandingReceivables * ratio),
      supplierPayables: Math.round(MOCK_DASHBOARD_METRICS.supplierPayables * ratio),
      stockValue: branch.stockValue,
      lowStockCount: Math.max(2, Math.round(MOCK_DASHBOARD_METRICS.lowStockCount * ratio)),
      expiringCount: Math.max(1, Math.round(MOCK_DASHBOARD_METRICS.expiringCount * ratio)),
      expectedCashInDrawer: Math.round(MOCK_DASHBOARD_METRICS.cashCollection * ratio),
      actualCashReported: Math.round(MOCK_DASHBOARD_METRICS.cashCollection * ratio) - 20,
      cashDiscrepancy: -20,
    };
  },

  async getHourlySales(branchId: BranchId = 'all'): Promise<typeof MOCK_HOURLY_SALES> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<typeof MOCK_HOURLY_SALES>('/api/v1/dashboard/hourly-velocity', {
        params: { branchId: branchId === 'all' ? undefined : branchId },
      });
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_HOURLY_SALES;
  },

  async getDailySales7D(branchId: BranchId = 'all'): Promise<typeof MOCK_DAILY_SALES_7D> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<typeof MOCK_DAILY_SALES_7D>('/api/v1/dashboard/daily-7d', {
        params: { branchId: branchId === 'all' ? undefined : branchId },
      });
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_DAILY_SALES_7D;
  },
};
