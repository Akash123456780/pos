import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/mockData';
import { authApi } from '../api';

export interface AuthUser {
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  role: string;
  planName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isSplashComplete: boolean;
  user: AuthUser | null;
  biometricsEnabled: boolean;
  pinEnabled: boolean;
  rememberDevice: boolean;
  setRememberDevice: (v: boolean) => void;
  login: (identifier: string, pass: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  setPin: (pin: string) => void;
  toggleBiometrics: (enabled: boolean) => void;
  loginWithBiometrics: () => Promise<boolean>;
  logout: () => void;
  logoutAllDevices: () => Promise<number>;
  finishSplash: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSplashComplete, setIsSplashComplete] = useState<boolean>(() => {
    return sessionStorage.getItem('nexus_splash_done') === 'true';
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nexus_auth_token') !== null;
  });

  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('nexus_biometric_enabled') === 'true';
  });
  const [pinEnabled, setPinEnabled] = useState<boolean>(() => {
    return localStorage.getItem('nexus_pin') !== null;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (localStorage.getItem('nexus_auth_token')) {
      return {
        name: BUSINESS_INFO.ownerName,
        mobile: BUSINESS_INFO.ownerMobile,
        email: BUSINESS_INFO.ownerEmail,
        businessName: BUSINESS_INFO.name,
        role: 'Owner & Super Admin',
        planName: BUSINESS_INFO.planName,
      };
    }
    return null;
  });

  const finishSplash = () => {
    setIsSplashComplete(true);
    sessionStorage.setItem('nexus_splash_done', 'true');
  };

  const login = async (identifier: string, pass: string) => {
    const res = await authApi.login(identifier, pass);
    localStorage.setItem('nexus_auth_token', res.token);
    setUser({
      name: res.user.ownerName,
      mobile: res.user.ownerMobile,
      email: res.user.ownerEmail,
      businessName: res.user.name,
      role: 'Owner & Super Admin',
      planName: res.user.planName,
    });
    setIsAuthenticated(true);
  };

  const verifyOtp = async (code: string) => {
    const res = await authApi.verifyOtp('+91 98450 12890', code);
    if (res.success) {
      localStorage.setItem('nexus_auth_token', 'jwt_verified_otp_session');
      setUser({
        name: BUSINESS_INFO.ownerName,
        mobile: BUSINESS_INFO.ownerMobile,
        email: BUSINESS_INFO.ownerEmail,
        businessName: BUSINESS_INFO.name,
        role: 'Owner & Super Admin',
        planName: BUSINESS_INFO.planName,
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const verifyPin = async (pin: string) => {
    const savedPin = localStorage.getItem('nexus_pin') || '1234';
    if (pin === savedPin) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const setPin = (pin: string) => {
    localStorage.setItem('nexus_pin', pin);
    setPinEnabled(true);
  };

  const toggleBiometrics = (enabled: boolean) => {
    setBiometricsEnabled(enabled);
    localStorage.setItem('nexus_biometric_enabled', enabled ? 'true' : 'false');
  };

  const loginWithBiometrics = async () => {
    const success = await authApi.biometricAuth();
    if (success) {
      localStorage.setItem('nexus_auth_token', 'jwt_biometric_authenticated');
      setUser({
        name: BUSINESS_INFO.ownerName,
        mobile: BUSINESS_INFO.ownerMobile,
        email: BUSINESS_INFO.ownerEmail,
        businessName: BUSINESS_INFO.name,
        role: 'Owner & Super Admin',
        planName: BUSINESS_INFO.planName,
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('nexus_auth_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const logoutAllDevices = async () => {
    const res = await authApi.logoutAllDevices();
    logout();
    return res.revokedCount;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isSplashComplete,
        user,
        biometricsEnabled,
        pinEnabled,
        rememberDevice,
        setRememberDevice,
        login,
        verifyOtp,
        verifyPin,
        setPin,
        toggleBiometrics,
        loginWithBiometrics,
        logout,
        logoutAllDevices,
        finishSplash,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
