/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';

// Common Components
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { SyncStatusBar } from './components/common/SyncStatusBar';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';

// Auth Components
import { SplashScreen } from './components/auth/SplashScreen';
import { LoginView } from './components/auth/LoginView';

// Dashboard & Core Views
import { TodaySummary } from './components/dashboard/TodaySummary';
import { SalesAnalyticsView } from './components/sales/SalesAnalyticsView';
import { ProfitLossView } from './components/sales/ProfitLossView';
import { InventoryDashboard } from './components/inventory/InventoryDashboard';
import { ProductDetailModal } from './components/inventory/ProductDetailModal';
import { BillsListView } from './components/bills/BillsListView';
import { BillDetailModal } from './components/bills/BillDetailModal';

// Directory & Management Views
import { CustomerDashboard } from './components/customers/CustomerDashboard';
import { CustomerDetailModal } from './components/customers/CustomerDetailModal';
import { SupplierDashboard } from './components/suppliers/SupplierDashboard';
import { SupplierDetailModal } from './components/suppliers/SupplierDetailModal';
import { StaffMonitoringView } from './components/staff/StaffMonitoringView';
import { StaffDetailModal } from './components/staff/StaffDetailModal';
import { ExpenseListView } from './components/expenses/ExpenseListView';
import { PaymentReconciliationView } from './components/payments/PaymentReconciliationView';
import { BranchManagementView } from './components/branches/BranchManagementView';
import { PosDevicesView } from './components/pos/PosDevicesView';

// Intelligence & Settings Views
import { BusinessHealthView } from './components/health/BusinessHealthView';
import { NotificationCenterView } from './components/notifications/NotificationCenterView';
import { ReportsListView } from './components/reports/ReportsListView';
import { GstSummaryView } from './components/reports/GstSummaryView';
import { ProfileView } from './components/profile/ProfileView';
import { ProfessionalPlanView } from './components/profile/ProfessionalPlanView';
import { SecurityCenterView } from './components/profile/SecurityCenterView';
import { SettingsView } from './components/profile/SettingsView';
import { MoreHubModal } from './components/more/MoreHubModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, isSplashComplete } = useAuth();
  const { activeTab, subView } = useApp();

  // 1. Splash Screen
  if (!isSplashComplete) {
    return <SplashScreen />;
  }

  // 2. Authentication Flow
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // 3. Authenticated App Layout
  const renderMainContent = () => {
    // If a subView is active, render that view
    if (subView !== 'none') {
      switch (subView) {
        case 'bills': return <BillsListView />;
        case 'customers': return <CustomerDashboard />;
        case 'suppliers': return <SupplierDashboard />;
        case 'staff': return <StaffMonitoringView />;
        case 'expenses': return <ExpenseListView />;
        case 'payments': return <PaymentReconciliationView />;
        case 'branches': return <BranchManagementView />;
        case 'pos': return <PosDevicesView />;
        case 'health': return <BusinessHealthView />;
        case 'notifications': return <NotificationCenterView />;
        case 'gst': return <GstSummaryView />;
        case 'profitLoss': return <ProfitLossView />;
        case 'professional-plan': return <ProfessionalPlanView />;
        case 'security': return <SecurityCenterView />;
        case 'settings': return <SettingsView />;
        case 'profile': return <ProfileView />;
        default: break;
      }
    }

    // Otherwise render based on primary bottom/sidebar tab
    switch (activeTab) {
      case 'home': return <TodaySummary />;
      case 'sales': return <SalesAnalyticsView />;
      case 'inventory': return <InventoryDashboard />;
      case 'reports': return <ReportsListView />;
      case 'more': return <MoreHubModal />;
      default: return <TodaySummary />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors">
      
      {/* Toast Overlay */}
      <ToastContainer />

      {/* Detail Modals */}
      <GlobalSearchModal />
      <BillDetailModal />
      <ProductDetailModal />
      <CustomerDetailModal />
      <SupplierDetailModal />
      <StaffDetailModal />

      {/* Desktop / Tablet Sidebar (Hidden on mobile <768px) */}
      <Navigation />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
        <PWAInstallBanner />
        <Header />
        <SyncStatusBar />
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
