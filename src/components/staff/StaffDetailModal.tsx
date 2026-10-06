import React from 'react';
import { 
  X, 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Receipt, 
  Tag, 
  RotateCcw, 
  IndianRupee, 
  MonitorDot, 
  ShieldAlert, 
  CheckCircle2, 
  Smartphone,
  Calendar,
  Layers,
  Wallet,
  FileDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';

export const StaffDetailModal: React.FC = () => {
  const { selectedStaff, setSelectedStaff, showToast } = useApp();

  if (!selectedStaff) return null;

  const st = selectedStaff;
  const avgBill = st.todayBillsCount > 0 ? Math.round(st.todaySales / st.todayBillsCount) : 0;

  const handlePingStaff = () => {
    showToast({
      type: 'success',
      title: 'POS Terminal Alerted',
      message: `Direct manager notification sent to ${st.name} at ${st.posTerminalAssigned}.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold text-sm">
              {st.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{st.name}</span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                  {st.role}
                </span>
                <StatusBadge status={st.status} size="sm" />
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {st.branchName} · Assigned: {st.posTerminalAssigned}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedStaff(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Profile Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
              Personnel Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mobile Phone:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{st.mobile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Company Email:</span>
                <span className="text-slate-700 dark:text-slate-300">{st.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Branch:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{st.branchName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Active:</span>
                <span className="text-emerald-600 font-bold">{st.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Current Shift Card */}
          <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Current Shift Information
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold">
                {st.status}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Shift Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{st.currentShift}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Clocked In</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{st.shiftStartTime}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">POS Terminal</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 truncate block">{st.posTerminalAssigned}</span>
              </div>
            </div>
          </div>

          {/* Summary Metric Grids */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono">
            {/* Sales Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                Sales Summary
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {formatINR(st.todaySales)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Avg Bill: {formatINR(avgBill)}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Receipt className="w-3 h-3 text-blue-500" />
                Bill Summary
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {st.todayBillsCount} Invoices
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">
                100% processed
              </div>
            </div>

            {/* Cash Collection */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-emerald-600" />
                Cash Collected
              </div>
              <div className="text-base font-bold text-emerald-600 mt-1">
                {formatINR(st.cashCollection)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Physical Cash in Till
              </div>
            </div>

            {/* UPI Collection */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-purple-500" />
                UPI Collection
              </div>
              <div className="text-base font-bold text-purple-600 dark:text-purple-400 mt-1">
                {formatINR(st.upiCollection)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Digital QR settlement
              </div>
            </div>

            {/* Discount Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-500" />
                Discount Summary
              </div>
              <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
                {formatINR(st.todayDiscounts)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Authorized discount
              </div>
            </div>

            {/* Return Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-rose-500" />
                Return Summary
              </div>
              <div className={`text-base font-bold mt-1 ${st.todayReturns > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                {st.todayReturns} Item{st.todayReturns !== 1 ? 's' : ''}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Customer returns
              </div>
            </div>
          </div>

          {/* Quick Manager Action */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Terminal Communications
              </div>
              <div className="text-[11px] text-slate-400">
                Send remote message or lock cash drawer
              </div>
            </div>
            <button
              type="button"
              onClick={handlePingStaff}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs transition-colors"
            >
              Ping Terminal
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedStaff(null)}
            className="py-2 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs transition-colors"
          >
            Close Staff Profile
          </button>
        </div>

      </div>
    </div>
  );
};
