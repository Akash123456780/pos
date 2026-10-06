import { httpClient, IS_MOCK_ENABLED } from './client';

export interface SyncStatus {
  lastSyncTimestamp: number;
  pendingUploadCount: number;
  isOnline: boolean;
  syncState: 'IDLE' | 'SYNCING' | 'ERROR' | 'OFFLINE';
  lastError?: string;
}

export interface SyncPayload {
  mutations: {
    id: string;
    action: string;
    endpoint: string;
    data: unknown;
    timestamp: number;
  }[];
}

export const syncApi = {
  async getSyncStatus(): Promise<SyncStatus> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<SyncStatus>('/api/v1/sync/status');
    }
    return {
      lastSyncTimestamp: Date.now() - 1000 * 60 * 2,
      pendingUploadCount: 0,
      isOnline: navigator.onLine,
      syncState: 'IDLE',
    };
  },

  async pushOfflineChanges(payload: SyncPayload): Promise<{ processed: number; failed: number }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ processed: number; failed: number }>('/api/v1/sync/push', payload);
    }
    await new Promise(r => setTimeout(r, 150));
    return {
      processed: payload.mutations.length,
      failed: 0,
    };
  },

  async pullLatestUpdates(sinceTimestamp: number): Promise<{ recordsUpdated: number }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<{ recordsUpdated: number }>('/api/v1/sync/pull', {
        params: { since: sinceTimestamp },
      });
    }
    await new Promise(r => setTimeout(r, 150));
    return { recordsUpdated: 12 };
  },
};
