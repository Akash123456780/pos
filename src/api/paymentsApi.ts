import { httpClient, IS_MOCK_ENABLED } from './client';
import { BranchId } from '../types';

export interface PaymentSummaryData {
  upi: number;
  cash: number;
  card: number;
  credit: number;
  total: number;
}

export interface CashReconciliationData {
  openingFloat: number;
  cashSales: number;
  cashExpenses: number;
  expectedTotal: number;
  actualReported: number;
  variance: number;
}

export const paymentsApi = {
  async getPaymentSummary(branchId: BranchId = 'all'): Promise<PaymentSummaryData> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<PaymentSummaryData>('/api/v1/payments/summary', {
        params: { branchId: branchId === 'all' ? undefined : branchId },
      });
    }

    await new Promise(r => setTimeout(r, 60));
    return {
      upi: 21350,
      cash: 18500,
      card: 7800,
      credit: 1000,
      total: 48650,
    };
  },

  async getCashReconciliation(branchId: BranchId = 'all'): Promise<CashReconciliationData> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<CashReconciliationData>('/api/v1/payments/reconciliation', {
        params: { branchId: branchId === 'all' ? undefined : branchId },
      });
    }

    await new Promise(r => setTimeout(r, 60));
    return {
      openingFloat: 2000,
      cashSales: 18500,
      cashExpenses: 2050,
      expectedTotal: 18450,
      actualReported: 18450,
      variance: 0,
    };
  },

  async saveReconciliation(data: { actualCash: number; note: string; shiftId?: string }): Promise<{ success: boolean; auditId: string }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean; auditId: string }>('/api/v1/payments/reconciliation', data);
    }

    await new Promise(r => setTimeout(r, 80));
    return { success: true, auditId: `aud_recon_${Date.now()}` };
  },
};
