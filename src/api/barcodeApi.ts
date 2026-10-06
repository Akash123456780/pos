import { httpClient, IS_MOCK_ENABLED } from './client';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

export interface BarcodeLookupResult {
  found: boolean;
  product?: Product;
  barcode: string;
}

export const barcodeApi = {
  async lookupBarcode(barcode: string): Promise<BarcodeLookupResult> {
    const cleanCode = barcode.trim();
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<BarcodeLookupResult>('/api/v1/barcode/lookup', {
        params: { code: cleanCode },
      });
    }

    await new Promise(r => setTimeout(r, 80));
    const prod = MOCK_PRODUCTS.find(p => p.barcode === cleanCode || p.sku.toLowerCase() === cleanCode.toLowerCase());
    if (prod) {
      return { found: true, product: prod, barcode: cleanCode };
    }
    return { found: false, barcode: cleanCode };
  },

  async registerBarcode(productId: string, barcode: string): Promise<{ success: boolean }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean }>(`/api/v1/products/${productId}/barcode`, { barcode });
    }
    await new Promise(r => setTimeout(r, 100));
    const prod = MOCK_PRODUCTS.find(p => p.id === productId);
    if (prod) {
      prod.barcode = barcode;
      return { success: true };
    }
    throw new Error('Product not found to assign barcode');
  },
};
