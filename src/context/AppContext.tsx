import React, { createContext, useContext, useState, useEffect } from 'react';
import { BranchId, Bill, Product, Customer, Supplier, StaffMember } from '../types';

export type DateFilterType = 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'last_month' | 'custom';
export type ActiveTabType = 'home' | 'sales' | 'inventory' | 'reports' | 'more';
export type SubViewType = 
  | 'none'
  | 'bills'
  | 'customers'
  | 'suppliers'
  | 'staff'
  | 'expenses'
  | 'branches'
  | 'pos'
  | 'health'
  | 'notifications'
  | 'security'
  | 'settings'
  | 'profile'
  | 'professional-plan'
  | 'gst'
  | 'profitLoss'
  | 'payments';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  activeBranchId: BranchId;
  setActiveBranchId: (id: BranchId) => void;
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
  
  // Navigation
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  subView: SubViewType;
  setSubView: (view: SubViewType) => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Connectivity & Sync
  isOnline: boolean;
  toggleOnline: () => void;
  isSyncing: boolean;
  lastSyncedAgo: string;
  syncNow: () => Promise<void>;

  // Global Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (v: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals for drill-downs
  selectedBill: Bill | null;
  setSelectedBill: (b: Bill | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (s: Supplier | null) => void;
  selectedStaff: StaffMember | null;
  setSelectedStaff: (st: StaffMember | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBranchId, setActiveBranchId] = useState<BranchId>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '2026-10-01', end: '2026-10-06' });
  
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [subView, setSubView] = useState<SubViewType>('none');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nexus_theme') === 'dark';
  });

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAgo, setLastSyncedAgo] = useState<string>('Just now');

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Item details modal state
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Sync theme class to root html/body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nexus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nexus_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleOnline = () => {
    setIsOnline(prev => {
      const next = !prev;
      if (!next) {
        showToast({
          type: 'warning',
          title: 'Offline Mode Simulated',
          message: "You're offline. Displaying cached NEXUS snapshot.",
        });
      } else {
        showToast({
          type: 'success',
          title: 'Back Online',
          message: 'Synchronized with NEXUS Cloud POS Cloud.',
        });
      }
      return next;
    });
  };

  const syncNow = async () => {
    if (!isOnline) {
      showToast({
        type: 'error',
        title: 'Sync Failed',
        message: 'Cannot sync while offline. Check internet connection.',
      });
      return;
    }
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSyncing(false);
    setLastSyncedAgo('Just now');
    showToast({
      type: 'success',
      title: 'Sync Complete',
      message: 'All store data updated successfully.',
    });
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        activeBranchId,
        setActiveBranchId,
        dateFilter,
        setDateFilter,
        customDateRange,
        setCustomDateRange,
        activeTab,
        setActiveTab,
        subView,
        setSubView,
        isDarkMode,
        toggleTheme,
        isOnline,
        toggleOnline,
        isSyncing,
        lastSyncedAgo,
        syncNow,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        removeToast,
        selectedBill,
        setSelectedBill,
        selectedProduct,
        setSelectedProduct,
        selectedCustomer,
        setSelectedCustomer,
        selectedSupplier,
        setSelectedSupplier,
        selectedStaff,
        setSelectedStaff,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
