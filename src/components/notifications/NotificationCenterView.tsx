import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ArrowLeft, 
  CheckCheck, 
  Boxes, 
  Clock, 
  TrendingUp, 
  CreditCard, 
  UserCheck, 
  ShieldAlert, 
  Database, 
  RefreshCw,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flame,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { notificationApi } from '../../api';
import { AppNotification, NotificationType } from '../../types';

export const NotificationCenterView: React.FC = () => {
  const { setSubView, setActiveTab, showToast } = useApp();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadNotifs() {
      const data = await notificationApi.getNotifications();
      if (isMounted) setNotifications(data);
    }
    loadNotifs();
    return () => { isMounted = false; };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast({
      type: 'success',
      title: 'All Alerts Marked as Read',
      message: 'Unread counter reset to 0.',
    });
  };

  const handleMarkRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await notificationApi.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleItemClick = (notif: AppNotification) => {
    if (!notif.isRead) {
      notificationApi.markAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    }

    // Open Related Module action
    if (notif.actionUrl === 'inventory' || notif.type === 'LOW_STOCK' || notif.type === 'EXPIRY') {
      setActiveTab('inventory');
      setSubView('none');
    } else if (notif.actionUrl === 'sales' || notif.type === 'SALES') {
      setActiveTab('sales');
      setSubView('none');
    } else if (notif.actionUrl === 'customers' || notif.type === 'PAYMENT') {
      setSubView('customers');
    } else if (notif.actionUrl === 'staff' || notif.type === 'STAFF') {
      setSubView('staff');
    } else if (notif.type === 'POS_OFFLINE') {
      setSubView('pos');
    } else if (notif.type === 'SECURITY') {
      setSubView('security');
    }
  };

  // Filter by Priority Category: Critical, High, Medium, Info
  // And Notification Type: Low Stock, Expiry, POS Offline, Security, Sales, Payment, Staff, Backup, Sync
  const filtered = notifications.filter(n => {
    const p = (n.priority || 'info').toLowerCase();
    const categoryMatch = 
      selectedCategory === 'ALL' ||
      (selectedCategory === 'CRITICAL' && p === 'critical') ||
      (selectedCategory === 'HIGH' && p === 'high') ||
      (selectedCategory === 'MEDIUM' && (p === 'medium' || p === 'low')) ||
      (selectedCategory === 'INFO' && p === 'info');

    const typeMatch = 
      selectedType === 'ALL' ||
      n.type === selectedType;

    return categoryMatch && typeMatch;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'LOW_STOCK': return <Boxes className="w-4 h-4 text-amber-500" />;
      case 'EXPIRY': return <Clock className="w-4 h-4 text-rose-500" />;
      case 'POS_OFFLINE': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'SECURITY': return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'SALES': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'PAYMENT': return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'STAFF': return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'BACKUP': return <Database className="w-4 h-4 text-indigo-500" />;
      case 'SYNC': return <RefreshCw className="w-4 h-4 text-teal-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    const p = (priority || 'info').toUpperCase();
    if (p === 'CRITICAL') {
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-500 text-white">CRITICAL</span>;
    }
    if (p === 'HIGH') {
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500 text-white">HIGH</span>;
    }
    if (p === 'MEDIUM') {
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">MEDIUM</span>;
    }
    return <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">INFO</span>;
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSubView('none')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                Notification Center
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time operational alerts, inventory triggers, security logs & shift events
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 self-start sm:self-auto transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* CATEGORY PRIORITY FILTER TABS: Critical, High, Medium, Info */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          Priority:
        </span>
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'CRITICAL', label: 'Critical' },
          { id: 'HIGH', label: 'High' },
          { id: 'MEDIUM', label: 'Medium' },
          { id: 'INFO', label: 'Info' },
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATION TYPE FILTER CHIPS: Low Stock, Expiry, POS Offline, Security, Sales, Payment, Staff, Backup, Sync */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase mr-1">
          Type:
        </span>
        {[
          { id: 'ALL', label: 'All Types' },
          { id: 'LOW_STOCK', label: 'Low Stock' },
          { id: 'EXPIRY', label: 'Expiry' },
          { id: 'POS_OFFLINE', label: 'POS Offline' },
          { id: 'SECURITY', label: 'Security' },
          { id: 'SALES', label: 'Sales' },
          { id: 'PAYMENT', label: 'Payment' },
          { id: 'STAFF', label: 'Staff' },
          { id: 'BACKUP', label: 'Backup' },
          { id: 'SYNC', label: 'Sync' },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedType(t.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedType === t.id
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 italic text-xs">
            No notifications matching current filters.
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-4 flex items-start gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                !notif.isRead ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
              }`}
            >
              {/* Icon */}
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getPriorityBadge(notif.priority)}
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {notif.timeAgo || 'Just now'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {notif.message}
                </p>

                {/* Location & Module Link */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono">
                  <span className="text-slate-400">
                    {notif.branchName ? `Branch: ${notif.branchName}` : 'Store Network Alert'}
                  </span>

                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={e => handleMarkRead(e, notif.id)}
                        className="text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark Read</span>
                      </button>
                    )}

                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      Open Module <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
