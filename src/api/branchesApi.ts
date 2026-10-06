import { httpClient, IS_MOCK_ENABLED } from './client';
import { Branch, BranchId } from '../types';
import { MOCK_BRANCHES } from '../data/mockData';

export interface BranchComparisonData {
  timeframe: 'today' | '7d' | '30d' | 'month';
  branches: {
    id: BranchId;
    name: string;
    sales: number;
    profit: number;
    expenses: number;
    bills: number;
    averageBillValue: number;
  }[];
}

export const branchApi = {
  async getBranches(): Promise<Branch[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Branch[]>('/api/v1/branches');
    }
    await new Promise(r => setTimeout(r, 60));
    return [...MOCK_BRANCHES];
  },

  async getBranchById(id: BranchId): Promise<Branch | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Branch>(`/api/v1/branches/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_BRANCHES.find(b => b.id === id);
  },

  async getBranchComparison(timeframe: 'today' | '7d' | '30d' | 'month' = 'today'): Promise<BranchComparisonData> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<BranchComparisonData>('/api/v1/branches/comparison', {
        params: { timeframe },
      });
    }

    await new Promise(r => setTimeout(r, 80));
    const multipliers: Record<string, number> = {
      today: 1,
      '7d': 6.8,
      '30d': 28.5,
      month: 26.2,
    };
    const mult = multipliers[timeframe] || 1;

    return {
      timeframe,
      branches: MOCK_BRANCHES.map(b => {
        const sales = Math.round(b.todaySales * mult);
        const profit = Math.round(b.todayProfit * mult);
        const expenses = Math.round(b.todaySales * 0.12 * mult);
        const bills = Math.round(b.todayBills * mult);
        const averageBillValue = bills > 0 ? Math.round(sales / bills) : 0;
        return {
          id: b.id as BranchId,
          name: b.name,
          sales,
          profit,
          expenses,
          bills,
          averageBillValue,
        };
      }),
    };
  },
};
