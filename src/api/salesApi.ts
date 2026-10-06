import { httpClient, IS_MOCK_ENABLED } from './client';
import { BranchId } from '../types';
import { MOCK_MONTHLY_PL, MOCK_DAILY_SALES_7D, MOCK_HOURLY_SALES } from '../data/mockData';

export const salesApi = {
  async getSalesAnalytics(branchId: BranchId = 'all', period = '7d') {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get('/api/v1/sales/analytics', {
        params: { branchId: branchId === 'all' ? undefined : branchId, period },
      });
    }
    await new Promise(r => setTimeout(r, 60));
    return {
      dailySales: MOCK_DAILY_SALES_7D,
      hourlyVelocity: MOCK_HOURLY_SALES,
      totalSales: 48650,
      totalProfit: 14200,
      marginPercent: 29.18,
    };
  },

  async getProfitLoss(branchId: BranchId = 'all', month = '2026-10') {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get('/api/v1/sales/profit-loss', {
        params: { branchId: branchId === 'all' ? undefined : branchId, month },
      });
    }
    await new Promise(r => setTimeout(r, 60));
    return MOCK_MONTHLY_PL;
  },
};
