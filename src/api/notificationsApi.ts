import { httpClient, IS_MOCK_ENABLED } from './client';
import { AppNotification, NotificationType } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

export const notificationApi = {
  async getNotifications(category?: string): Promise<AppNotification[]> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.get<AppNotification[]>('/api/v1/notifications', {
        params: { category: category === 'ALL' ? undefined : category },
      });
    }
    await new Promise(r => setTimeout(r, 60));
    if (!category || category === 'ALL') {
      return [...MOCK_NOTIFICATIONS];
    }
    return MOCK_NOTIFICATIONS.filter(n => n.type === category || n.priority === category.toLowerCase());
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.request<{ success: boolean }>(`/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
      });
    }
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (notif) notif.isRead = true;
    return { success: true };
  },

  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    if (!IS_MOCK_ENABLED) {
      return httpClient.post<{ success: boolean; count: number }>('/api/v1/notifications/mark-all-read');
    }
    let count = 0;
    MOCK_NOTIFICATIONS.forEach(n => {
      if (!n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    return { success: true, count };
  },

  async getUnreadCount(): Promise<number> {
    if (!IS_MOCK_ENABLED) {
      const res = await httpClient.get<{ count: number }>('/api/v1/notifications/unread-count');
      return res.count;
    }
    return MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
  },
};
