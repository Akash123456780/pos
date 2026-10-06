import { httpClient, IS_MOCK_ENABLED } from './client';
import { BusinessHealthMetric } from '../types';
import { MOCK_BUSINESS_HEALTH } from '../data/mockData';

export interface HealthSummary {
  overallScore: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  categories: BusinessHealthMetric[];
}

export const healthApi = {
  async getHealthMetrics(): Promise<BusinessHealthMetric[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<BusinessHealthMetric[]>('/api/v1/health/metrics');
    }
    await new Promise(r => setTimeout(r, 60));
    return [...MOCK_BUSINESS_HEALTH];
  },

  async getHealthSummary(): Promise<HealthSummary> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<HealthSummary>('/api/v1/health/summary');
    }
    await new Promise(r => setTimeout(r, 60));
    return {
      overallScore: 89,
      status: 'GOOD',
      categories: [...MOCK_BUSINESS_HEALTH],
    };
  },
};
