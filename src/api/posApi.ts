import { httpClient, IS_MOCK_ENABLED } from './client';
import { PosDevice } from '../types';
import { MOCK_POS_DEVICES } from '../data/mockData';

export interface PosDiagnosticResult {
  deviceId: string;
  printerStatus: 'Connected' | 'Disconnected' | 'Out of Paper';
  scannerStatus: 'Connected' | 'Disconnected';
  networkStatus: 'EXCELLENT' | 'GOOD' | 'POOR' | 'DISCONNECTED';
  syncStatus: 'SYNCHRONIZED' | 'SYNCING' | 'PENDING' | 'ERROR';
  pingMs: number;
  lastActiveTime: string;
}

export const posApi = {
  async getDevices(): Promise<PosDevice[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<PosDevice[]>('/api/v1/pos/devices');
    }
    await new Promise(r => setTimeout(r, 60));
    return [...MOCK_POS_DEVICES];
  },

  async getDeviceById(id: string): Promise<PosDevice | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<PosDevice>(`/api/v1/pos/devices/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_POS_DEVICES.find(d => d.id === id);
  },

  async pingDevice(id: string): Promise<{ success: boolean; latencyMs: number; timestamp: string }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean; latencyMs: number; timestamp: string }>(`/api/v1/pos/devices/${id}/ping`);
    }
    await new Promise(r => setTimeout(r, 120));
    return {
      success: true,
      latencyMs: Math.floor(Math.random() * 25) + 12,
      timestamp: new Date().toLocaleTimeString(),
    };
  },

  async requestSync(id: string): Promise<{ success: boolean; syncedItemsCount: number; timestamp: string }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean; syncedItemsCount: number; timestamp: string }>(`/api/v1/pos/devices/${id}/sync`);
    }
    await new Promise(r => setTimeout(r, 200));
    const dev = MOCK_POS_DEVICES.find(d => d.id === id);
    if (dev) {
      dev.lastSyncTime = 'Just now';
      dev.pendingSyncBills = 0;
    }
    return {
      success: true,
      syncedItemsCount: 42,
      timestamp: new Date().toLocaleTimeString(),
    };
  },

  async remoteLogout(id: string): Promise<{ success: boolean; message: string }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean; message: string }>(`/api/v1/pos/devices/${id}/remote-logout`);
    }
    await new Promise(r => setTimeout(r, 150));
    const dev = MOCK_POS_DEVICES.find(d => d.id === id);
    if (dev) {
      dev.status = 'IDLE';
      dev.currentCashier = 'Unassigned';
    }
    return {
      success: true,
      message: `Terminal ${dev?.deviceName || id} session logged out remotely.`,
    };
  },

  async refreshStatus(id: string): Promise<PosDevice> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<PosDevice>(`/api/v1/pos/devices/${id}/status`);
    }
    await new Promise(r => setTimeout(r, 100));
    const dev = MOCK_POS_DEVICES.find(d => d.id === id);
    if (!dev) throw new Error('Device not found');
    return { ...dev, lastActiveTime: 'Just now' };
  },
};
