import { httpClient, IS_MOCK_ENABLED } from './client';
import { BranchId, Expense } from '../types';
import { MOCK_EXPENSES } from '../data/mockData';

export const expenseApi = {
  async getExpenses(branchId: BranchId = 'all'): Promise<Expense[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Expense[]>('/api/v1/expenses', {
        params: { branchId: branchId === 'all' ? undefined : branchId },
      });
    }

    await new Promise(r => setTimeout(r, 60));
    if (branchId === 'all') return MOCK_EXPENSES;
    return MOCK_EXPENSES.filter(e => e.branchId === branchId);
  },

  async addExpense(newExp: Omit<Expense, 'id'>): Promise<Expense> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<Expense>('/api/v1/expenses', newExp);
    }

    await new Promise(r => setTimeout(r, 80));
    const created: Expense = {
      ...newExp,
      id: `exp_${Date.now()}`,
    };
    MOCK_EXPENSES.unshift(created);
    return created;
  },
};
