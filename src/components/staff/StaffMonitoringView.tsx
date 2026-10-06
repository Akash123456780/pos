import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ArrowLeft, 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  Receipt, 
  Tag, 
  RotateCcw, 
  MonitorDot, 
  History,
  CheckCircle2,
  AlertTriangle,
  Users,
  IndianRupee,
  ChevronRight,
  Filter,
  Search,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { staffApi } from '../../api';
import { StaffMember, StaffAuditLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';
import { FilterChips } from '../common/FilterChips';

export const StaffMonitoringView: React.FC = () => {
  const { activeBranchId, setSubView, setSelectedStaff } = useApp();
  const [activeTab, setActiveTab] = useState<'staff' | 'audit'>('staff');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [auditLogs, setAuditLogs] = useState<StaffAuditLog[]>([]);
  const [selectedAuditFilter, setSelectedAuditFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchStaffData() {
      setIsLoading(true);
      try {
        const [stfs, logs] = await Promise.all([
          staffApi.getStaff(activeBranchId),
          staffApi.getAuditLogs(),
        ]);
        if (isMounted) {
          setStaffList(stfs);
          setAuditLogs(logs);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchStaffData();
    return () => { isMounted = false; };
  }, [activeBranchId]);

  // Aggregate metrics
  const totalStaff = staffList.length;
  const onlineStaff = staffList.filter(s => s.status === 'ONLINE').length;
  const onShiftStaff = staffList.filter(s => s.status !== 'OFFLINE').length;
  const todaySales = staffList.reduce((acc, s) => acc + s.todaySales, 0);
  const todayBills = staffList.reduce((acc, s) => acc + s.todayBillsCount, 0);
  const todayDiscounts = staffList.reduce((acc, s) => acc + s.todayDiscounts, 0);
  const todayReturns = staffList.reduce((acc, s) => acc + s.todayReturns, 0);

  // Audit filter mapping
  const auditFilterOptions = [
    { id: 'ALL', label: 'All Activities' },
    { id: 'LOGIN', label: 'Login' },
    { id: 'LOGOUT', label: 'Logout' },
    { id: 'BILL_CREATED', label: 'Bill Created' },
    { id: 'BILL_CANCELLED', label: 'Bill Cancelled' },
    { id: 'DISCOUNT_APPLIED', label: 'Discount Applied' },
    { id: 'RETURN_PROCESSED', label: 'Return' },
    { id: 'DRAWER_OPENED', label: 'Cash Drawer Open' },
    { id: 'STOCK_ADJUSTMENT', label: 'Stock Adjustment' },
    { id: 'EXPENSE_ADDED', label: 'Expense Added' },
  ];

  const filteredLogs = selectedAuditFilter === 'ALL'
    ? auditLogs
    : auditLogs.filter(log => log.action === selectedAuditFilter);

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
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
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              Staff & Cashier Shifts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live terminal shifts, staff sales performance & operational audit trail
            </p>
          </div>
        </div>
      </div>

      {/* 7 DASHBOARD METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Total Staff</span>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
            {totalStaff}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Roster Count</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-emerald-500 block truncate">Online</span>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {onlineStaff} Active
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Connected</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-blue-500 block truncate">On Shift</span>
          <div className="text-base sm:text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {onShiftStaff} Staff
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Current Shift</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Today&apos;s Sales</span>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(todaySales)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Terminal Billed</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-slate-400 block truncate">Today&apos;s Bills</span>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
            {todayBills}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Invoices Cut</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-amber-500 block truncate">Discounts</span>
          <div className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {formatINR(todayDiscounts)}
          </div>
          <span className="text-[10px] text-amber-600 block mt-0.5">Authorised</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-mono text-rose-500 block truncate">Returns</span>
          <div className="text-base sm:text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {todayReturns}
          </div>
          <span className="text-[10px] text-rose-500 block mt-0.5">Customer items</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'staff'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Staff & Shift Roster ({staffList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Live Audit Timeline ({auditLogs.length})</span>
        </button>
      </div>

      {/* STAFF LIST TAB */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffList.map(member => (
            <div
              key={member.id}
              onClick={() => setSelectedStaff(member)}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:border-emerald-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition-all"
            >
              {/* Card Header: Name, Role, Status, Branch */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {member.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                      {member.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    {member.branchName} · {member.mobile}
                  </div>
                </div>
                <StatusBadge status={member.status} />
              </div>

              {/* Shift and Terminal badge */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 text-[11px]">Shift:</span>
                  <span className="font-semibold text-[11px] truncate max-w-[200px]">{member.currentShift}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  <span className="text-slate-400">Terminal:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{member.posTerminalAssigned}</span>
                </div>
              </div>

              {/* Performance Metrics: Sales, Bills, Cash Collected */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono py-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <div className="p-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-slate-400 text-[10px] uppercase block">Sales</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{formatINR(member.todaySales)}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-slate-400 text-[10px] uppercase block">Bills</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{member.todayBillsCount}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-slate-400 text-[10px] uppercase block">Cash Coll.</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">{formatINR(member.cashCollection)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 font-mono">
                <span>Discounts: {formatINR(member.todayDiscounts)} · Returns: {member.todayReturns}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  View Detail <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AUDIT LOG TIMELINE TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Audit Action Filter Chips */}
          <FilterChips
            options={auditFilterOptions}
            selected={selectedAuditFilter}
            onChange={id => setSelectedAuditFilter(id)}
          />

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic text-xs">
                  No audit logs matching selected filter.
                </div>
              ) : (
                filteredLogs.map(log => {
                  const isFlagged = log.severity === 'flagged';
                  const isCritical = log.severity === 'critical';

                  return (
                    <div 
                      key={log.id} 
                      className={`flex items-start gap-3 p-3.5 rounded-2xl transition-colors ${
                        isCritical 
                          ? 'bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40' 
                          : isFlagged 
                            ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40' 
                            : 'bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800'
                      }`}
                    >
                      <div className="pt-0.5 flex-shrink-0">
                        {isCritical ? (
                          <ShieldAlert className="w-4 h-4 text-rose-500" />
                        ) : isFlagged ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {log.details}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 whitespace-nowrap bg-white dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                            {log.timeAgo} ({log.timestamp})
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                          <span>Staff: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{log.staffName}</strong> ({log.role})</span>
                          <span>·</span>
                          <span>Branch: {log.branchName}</span>
                          <span>·</span>
                          <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                            {log.action.replace('_', ' ')}
                          </span>
                        </div>

                        {log.amount && (
                          <div className="text-[11px] font-mono font-bold text-slate-900 dark:text-white mt-1">
                            Impact: {formatINR(log.amount)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
