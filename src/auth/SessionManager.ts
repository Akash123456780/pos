/**
 * Session Manager for NEXUS OWNER Platform
 * Tracks authenticated owner profile, active roles, and authorization boundary.
 */

export type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'MANAGER' | 'CASHIER';

export interface OwnerSessionUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: UserRole;
  businessName: string;
  gstin: string;
  deviceId: string;
  loginTimestamp: number;
}

class SessionManagerImpl {
  private currentUser: OwnerSessionUser | null = null;
  private readonly SESSION_STORAGE_KEY = 'nx_owner_session';

  constructor() {
    try {
      const stored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      // Storage restricted
    }
  }

  public getSession(): OwnerSessionUser | null {
    return this.currentUser;
  }

  public setSession(user: OwnerSessionUser): void {
    // Strictly validate role: CASHIER is prohibited from accessing Owner Platform
    if (user.role === 'CASHIER') {
      throw new Error('Access Denied: Cashier accounts cannot log into the NEXUS Owner Management Platform.');
    }

    this.currentUser = user;
    try {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }
  }

  public clearSession(): void {
    this.currentUser = null;
    try {
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  public isOwnerOrAdmin(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === 'OWNER' || this.currentUser.role === 'SUPER_ADMIN';
  }

  public getDeviceId(): string {
    let id = localStorage.getItem('nx_device_uuid');
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('nx_device_uuid', id);
    }
    return id;
  }
}

export const SessionManager = new SessionManagerImpl();
