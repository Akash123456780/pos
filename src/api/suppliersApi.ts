import { httpClient, IS_MOCK_ENABLED } from './client';
import { Supplier } from '../types';
import { MOCK_SUPPLIERS } from '../data/mockData';

export const supplierApi = {
  async getSuppliers(search?: string): Promise<Supplier[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Supplier[]>('/api/v1/suppliers', {
        params: { search: search || undefined },
      });
    }

    await new Promise(r => setTimeout(r, 60));
    let list = [...MOCK_SUPPLIERS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q));
    }
    return list;
  },

  async getSupplierById(id: string): Promise<Supplier | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Supplier>(`/api/v1/suppliers/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_SUPPLIERS.find(s => s.id === id);
  },

  async recordSupplierPayment(
    supplierId: string,
    payment: { amount: number; paymentMode: string; reference?: string; notes?: string }
  ): Promise<{ success: boolean; newBalance: number; voucherNumber: string }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean; newBalance: number; voucherNumber: string }>(
        `/api/v1/suppliers/${supplierId}/payments`,
        payment
      );
    }

    await new Promise(r => setTimeout(r, 100));
    const sup = MOCK_SUPPLIERS.find(s => s.id === supplierId);
    if (!sup) throw new Error('Supplier not found');

    const prev = sup.outstandingPayables;
    const newBal = Math.max(0, prev - payment.amount);
    sup.outstandingPayables = newBal;
    sup.dueToday = Math.max(0, sup.dueToday - payment.amount);
    sup.isOverdue = newBal > 0 ? sup.isOverdue : false;

    const voucherNumber = payment.reference || `DISB-${Date.now().toString().slice(-6)}`;
    sup.ledgerEntries.unshift({
      id: `sle_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      invoiceNo: voucherNumber,
      type: 'PAYMENT',
      debit: payment.amount,
      credit: 0,
      balance: newBal,
    });

    return { success: true, newBalance: newBal, voucherNumber };
  },

  async getPurchases() {
    return (await import('./purchasesApi')).purchasesApi.getPurchases();
  },
};
