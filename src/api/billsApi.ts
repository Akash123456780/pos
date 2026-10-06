import { httpClient, IS_MOCK_ENABLED } from './client';
import { Bill, BranchId } from '../types';
import { MOCK_BILLS } from '../data/mockData';

export const billsApi = {
  async getBills(filters?: { branchId?: BranchId; status?: string; search?: string }): Promise<Bill[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Bill[]>('/api/v1/bills', {
        params: {
          branchId: filters?.branchId === 'all' ? undefined : filters?.branchId,
          status: filters?.status === 'ALL' ? undefined : filters?.status,
          search: filters?.search || undefined,
        },
      });
    }

    // Mock Mode
    await new Promise(r => setTimeout(r, 80));
    let list = [...MOCK_BILLS];
    if (filters?.branchId && filters.branchId !== 'all') {
      list = list.filter(b => b.branchId === filters.branchId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(b => b.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(b => 
        b.billNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerMobile.includes(q) ||
        b.cashierName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getBillById(id: string): Promise<Bill | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Bill>(`/api/v1/bills/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_BILLS.find(b => b.id === id);
  },
};
