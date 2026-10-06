import { httpClient, IS_MOCK_ENABLED } from './client';
import { Product, InventoryAlert } from '../types';
import { MOCK_PRODUCTS, MOCK_INVENTORY_ALERTS } from '../data/mockData';

export const inventoryApi = {
  async getProducts(filters?: { category?: string; filterType?: string; search?: string }): Promise<Product[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Product[]>('/api/v1/inventory/products', {
        params: {
          category: filters?.category === 'All' ? undefined : filters?.category,
          filterType: filters?.filterType,
          search: filters?.search,
        },
      });
    }

    // Mock Mode
    await new Promise(r => setTimeout(r, 80));
    let list = [...MOCK_PRODUCTS];
    if (filters?.category && filters.category !== 'All') {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters?.filterType) {
      if (filters.filterType === 'low_stock') {
        list = list.filter(p => p.currentStock > 0 && p.currentStock <= p.minStock);
      } else if (filters.filterType === 'out_of_stock') {
        list = list.filter(p => p.currentStock === 0);
      } else if (filters.filterType === 'expiring') {
        list = list.filter(p => p.shelfLifeDays && p.shelfLifeDays <= 30);
      } else if (filters.filterType === 'fast_moving') {
        list = list.filter(p => p.fastMoving);
      } else if (filters.filterType === 'slow_moving') {
        list = list.filter(p => !p.fastMoving);
      }
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<Product>(`/api/v1/inventory/products/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_PRODUCTS.find(p => p.id === id);
  },

  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<InventoryAlert[]>('/api/v1/inventory/alerts');
    }
    await new Promise(r => setTimeout(r, 60));
    return MOCK_INVENTORY_ALERTS;
  },

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    if (!IS_MOCK_ENABLED) {
      try {
        return await httpClient.get<Product>(`/api/v1/inventory/products/barcode/${encodeURIComponent(barcode)}`);
      } catch {
        return undefined;
      }
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_PRODUCTS.find(p => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase());
  },
};
