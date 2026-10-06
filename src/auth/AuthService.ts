/**
 * Production Authentication Service for NEXUS OWNER Platform
 * Connects frontend login, OTP, PIN, and biometric verification to backend endpoints.
 */

import { httpClient, IS_MOCK_ENABLED, PermissionError } from '../api/client';
import { TokenManager } from './TokenManager';
import { SessionManager, OwnerSessionUser, UserRole } from './SessionManager';
import { BUSINESS_INFO } from '../data/mockData';

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  requiresOtp?: boolean;
  user: {
    id: string;
    ownerName: string;
    mobile: string;
    email: string;
    role: UserRole;
    businessName: string;
    gstin: string;
  };
}

export interface OtpVerifyResponse {
  sessionVerified: boolean;
  accessToken: string;
  refreshToken?: string;
}

export const AuthService = {
  /**
   * Owner credentials login
   * POST /api/v1/auth/owner-login
   */
  async login(identifier: string, pass: string): Promise<{ token: string; user: typeof BUSINESS_INFO }> {
    if (!identifier || !pass) {
      throw new Error('Owner identifier (mobile or email) and password are required.');
    }

    if (IS_MOCK_ENABLED) {
      await new Promise(r => setTimeout(r, 150));
      const mockToken = `jwt_mock_nexus_owner_${Date.now()}`;
      TokenManager.setTokens(mockToken, 'jwt_mock_refresh_token');

      SessionManager.setSession({
        id: 'owner_01',
        name: BUSINESS_INFO.ownerName,
        mobile: BUSINESS_INFO.ownerMobile,
        email: BUSINESS_INFO.ownerEmail,
        role: 'OWNER',
        businessName: BUSINESS_INFO.name,
        gstin: BUSINESS_INFO.gstin,
        deviceId: SessionManager.getDeviceId(),
        loginTimestamp: Date.now(),
      });

      return {
        token: mockToken,
        user: BUSINESS_INFO,
      };
    }

    // Production Real API call
    const res = await httpClient.post<LoginResponse>('/api/v1/auth/owner-login', {
      identifier,
      password: pass,
      deviceId: SessionManager.getDeviceId(),
    }, { skipAuth: true });

    if (res.user.role === 'CASHIER') {
      throw new PermissionError('Cashier accounts cannot access the NEXUS Owner app. Owner or Admin credentials required.');
    }

    TokenManager.setTokens(res.token, res.refreshToken);

    SessionManager.setSession({
      id: res.user.id,
      name: res.user.ownerName,
      mobile: res.user.mobile,
      email: res.user.email,
      role: res.user.role,
      businessName: res.user.businessName,
      gstin: res.user.gstin,
      deviceId: SessionManager.getDeviceId(),
      loginTimestamp: Date.now(),
    });

    return {
      token: res.token,
      user: {
        ...BUSINESS_INFO,
        name: res.user.businessName,
        ownerName: res.user.ownerName,
        ownerEmail: res.user.email,
        ownerMobile: res.user.mobile,
        gstin: res.user.gstin,
      },
    };
  },

  /**
   * 2FA OTP Verification
   * POST /api/v1/auth/verify-otp
   */
  async verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; sessionVerified: boolean }> {
    if (IS_MOCK_ENABLED) {
      await new Promise(r => setTimeout(r, 150));
      if (otp === '123456' || otp.length === 6) {
        return { success: true, sessionVerified: true };
      }
      throw new Error('Invalid OTP code. Please enter 123456 in demo mode.');
    }

    const res = await httpClient.post<OtpVerifyResponse>('/api/v1/auth/verify-otp', {
      mobile,
      otp,
      deviceId: SessionManager.getDeviceId(),
    }, { skipAuth: true });

    if (res.accessToken) {
      TokenManager.setTokens(res.accessToken, res.refreshToken);
    }

    return { success: true, sessionVerified: res.sessionVerified };
  },

  /**
   * Quick Owner PIN Verification
   * POST /api/v1/auth/verify-pin
   */
  async verifyPin(pin: string): Promise<boolean> {
    if (IS_MOCK_ENABLED) {
      await new Promise(r => setTimeout(r, 100));
      return pin === '1234' || pin.length === 4;
    }

    const res = await httpClient.post<{ valid: boolean }>('/api/v1/auth/verify-pin', {
      pin,
      deviceId: SessionManager.getDeviceId(),
    });
    return res.valid;
  },

  /**
   * Hardware biometric verification placeholder (WebAuthn / native Capacitor Biometrics)
   */
  async biometricAuth(): Promise<boolean> {
    await new Promise(r => setTimeout(r, 150));
    return true;
  },

  /**
   * Session Logout
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    if (!IS_MOCK_ENABLED) {
      try {
        await httpClient.post('/api/v1/auth/logout', {
          deviceId: SessionManager.getDeviceId(),
        });
      } catch {
        // Safe fallback if network unavailable
      }
    }
    TokenManager.clearTokens();
    SessionManager.clearSession();
  },

  /**
   * Revoke all remote active sessions
   * POST /api/v1/auth/logout-all-devices
   */
  async logoutAllDevices(): Promise<{ revokedCount: number }> {
    if (IS_MOCK_ENABLED) {
      await new Promise(r => setTimeout(r, 200));
      return { revokedCount: 3 };
    }

    const res = await httpClient.post<{ revokedCount: number }>('/api/v1/auth/logout-all-devices');
    return res;
  },
};
