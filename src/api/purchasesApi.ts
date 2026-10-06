import { httpClient, IS_MOCK_ENABLED } from './client';
import { Purchase } from '../types';
import { MOCK_PURCHASES } from '../data/mockData';

export const purchasesApi = {
  async getPurchases(): Promise<Purchase[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Purchase[]>('/api/v1/purchases');
    }
    await new Promise(r => setTimeout(r, 60));
    return MOCK_PURCHASES;
  },

  async getPurchaseById(id: string): Promise<Purchase | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Purchase>(`/api/v1/purchases/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_PURCHASES.find(p => p.id === id);
  },
};
