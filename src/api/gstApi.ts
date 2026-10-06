import { httpClient, IS_MOCK_ENABLED } from './client';

export interface GstSummaryData {
  taxableSales: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalOutputGst: number;
  purchaseTax: number;
  inputTaxCredit: number;
  netTaxLiability: number;
}

export interface HsnSummaryItem {
  hsn: string;
  description: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

export interface MonthlyGstFiling {
  month: string;
  turnover: number;
  outputTax: number;
  itc: number;
  netPayable: number;
  status: string;
}

export const gstApi = {
  async getGstSummary(period = 'current_month'): Promise<GstSummaryData> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<GstSummaryData>('/api/v1/gst/summary', { params: { period } });
    }
    await new Promise(r => setTimeout(r, 60));
    return {
      taxableSales: 41230,
      cgst: 3710,
      sgst: 3710,
      igst: 0,
      totalOutputGst: 7420,
      purchaseTax: 4890,
      inputTaxCredit: 4890,
      netTaxLiability: 2530,
    };
  },

  async getHsnSummary(): Promise<HsnSummaryItem[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<HsnSummaryItem[]>('/api/v1/gst/hsn-summary');
    }
    await new Promise(r => setTimeout(r, 60));
    return [
      {
        hsn: '1101',
        description: 'Wheat or Meslin Flour (Atta)',
        taxableValue: 14200,
        cgst: 355,
        sgst: 355,
        igst: 0,
        totalTax: 710,
      },
      {
        hsn: '1512',
        description: 'Sunflower Seed Oil / Edible Oil',
        taxableValue: 8200,
        cgst: 205,
        sgst: 205,
        igst: 0,
        totalTax: 410,
      },
      {
        hsn: '0902',
        description: 'Tea Leaf & Dust Extracts',
        taxableValue: 4800,
        cgst: 120,
        sgst: 120,
        igst: 0,
        totalTax: 240,
      },
      {
        hsn: '1905',
        description: 'Biscuits, Bread, Cakes & Pastries',
        taxableValue: 6500,
        cgst: 585,
        sgst: 585,
        igst: 0,
        totalTax: 1170,
      },
      {
        hsn: '3401',
        description: 'Soap, Organic Surface-active Products',
        taxableValue: 7530,
        cgst: 678,
        sgst: 678,
        igst: 0,
        totalTax: 1356,
      },
    ];
  },

  async getMonthlyFilings(): Promise<MonthlyGstFiling[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<MonthlyGstFiling[]>('/api/v1/gst/filings');
    }
    await new Promise(r => setTimeout(r, 60));
    return [
      { month: 'September 2026', turnover: 1240000, outputTax: 111600, itc: 72400, netPayable: 39200, status: 'FILED (GSTR-3B)' },
      { month: 'August 2026', turnover: 1180000, outputTax: 106200, itc: 68900, netPayable: 37300, status: 'FILED (GSTR-3B)' },
      { month: 'July 2026', turnover: 1100000, outputTax: 99000, itc: 64200, netPayable: 34800, status: 'FILED (GSTR-3B)' },
    ];
  },
};
