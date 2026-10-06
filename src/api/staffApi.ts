import { httpClient, IS_MOCK_ENABLED } from './client';
import { BranchId, StaffMember, StaffAuditLog } from '../types';
import { MOCK_STAFF, MOCK_AUDIT_LOGS } from '../data/mockData';

export const staffApi = {
  async getStaff(branchId: BranchId = 'all'): Promise<StaffMember[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<StaffMember[]>('/api/v1/staff', {
        params: { branchId: branchId === 'all' ? undefined : branchId },
      });
    }

    await new Promise(r => setTimeout(r, 60));
    if (branchId === 'all') return MOCK_STAFF;
    return MOCK_STAFF.filter(s => s.branchId === branchId || s.branchId === 'all');
  },

  async getStaffById(id: string): Promise<StaffMember | undefined> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<StaffMember>(`/api/v1/staff/${id}`);
    }
    await new Promise(r => setTimeout(r, 50));
    return MOCK_STAFF.find(s => s.id === id);
  },

  async getAuditLogs(filterAction?: string): Promise<StaffAuditLog[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<StaffAuditLog[]>('/api/v1/staff/audit-logs', {
        params: { action: filterAction },
      });
    }

    await new Promise(r => setTimeout(r, 60));
    if (!filterAction || filterAction === 'ALL') return MOCK_AUDIT_LOGS;
    return MOCK_AUDIT_LOGS.filter(l => l.action === filterAction);
  },
};
