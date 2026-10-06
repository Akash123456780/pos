import { httpClient, IS_MOCK_ENABLED } from './client';
import { Customer } from '../types';
import { MOCK_CUSTOMERS } from '../data/mockData';

export const customerApi = {
  async getCustomers(search?: string, segment?: string): Promise<Customer[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Customer[]>('/api/v1/customers', {
        params: {
          search: search || undefined,
          segment: segment === 'ALL' ? undefined : segment,
        },
      });
    }

    // Mock Mode
    await new Promise(r => setTimeout(r, 60));
    let list = [...MOCK_CUSTOMERS];
    if (segment && segment !== 'ALL') {
      list = list.filter(c => c.segment === segment);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.mobile.includes(q));
    }
    return list;
  },

  async getCustomerById(id: string): Promise<Customer | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Customer>(`/api/v1/customers/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_CUSTOMERS.find(c => c.id === id);
  },

  async recordCustomerPayment(
    customerId: string, 
    payment: { amount: number; paymentMode: string; reference?: string; notes?: string }
  ): Promise<{ success: boolean; newBalance: number; receiptNumber: string }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean; newBalance: number; receiptNumber: string }>(
        `/api/v1/customers/${customerId}/payments`, 
        payment
      );
    }

    await new Promise(r => setTimeout(r, 100));
    const cust = MOCK_CUSTOMERS.find(c => c.id === customerId);
    if (!cust) throw new Error('Customer not found');

    const prev = cust.outstandingBalance;
    const newBal = Math.max(0, prev - payment.amount);
    cust.outstandingBalance = newBal;
    cust.isOverdue = newBal > 0 ? cust.isOverdue : false;

    const receiptNumber = payment.reference || `RCP-${Date.now().toString().slice(-6)}`;
    cust.ledgerEntries.unshift({
      id: `le_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'PAYMENT',
      refNumber: receiptNumber,
      debit: 0,
      credit: payment.amount,
      balance: newBal,
    });

    return { success: true, newBalance: newBal, receiptNumber };
  },
};
