import React, { useState, useEffect } from 'react';
import { 
  MonitorDot, 
  ArrowLeft, 
  Wifi, 
  Printer, 
  QrCode, 
  RefreshCw, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle,
  Smartphone,
  LogOut,
  Eye,
  X,
  Activity,
  Layers,
  Cpu,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { posApi } from '../../api';
import { PosDevice } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const PosDevicesView: React.FC = () => {
  const { setSubView, showToast } = useApp();
  const [devices, setDevices] = useState<PosDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<PosDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDevices() {
      setIsLoading(true);
      try {
        const data = await posApi.getDevices();
        if (isMounted) setDevices(data);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDevices();
    return () => { isMounted = false; };
  }, []);

  // Action: Refresh Status
  const handleRefreshStatus = async (dev: PosDevice) => {
    try {
      const updated = await posApi.refreshStatus(dev.id);
      setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, lastActiveTime: 'Just now' } : d));
      showToast({
        type: 'success',
        title: 'Status Refreshed',
        message: `${dev.deviceName} heartbeat verified. Status: ${dev.status}.`,
      });
    } catch {
      showToast({ type: 'error', title: 'Refresh Failed' });
    }
  };

  // Action: Request Sync
  const handleRequestSync = async (dev: PosDevice) => {
    try {
      // Simulate Syncing state
      setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, status: 'SYNCING' as any } : d));
      showToast({
        type: 'info',
        title: 'Sync Triggered',
        message: `Sync command dispatched to ${dev.deviceName}. Updating catalog and bills...`,
      });

      const res = await posApi.requestSync(dev.id);
      setTimeout(() => {
        setDevices(prev => prev.map(d => d.id === dev.id ? { 
          ...d, 
          status: 'ONLINE' as any, 
          lastSyncTime: 'Just now',
          lastBackupTime: 'Just now'
        } : d));
        showToast({
          type: 'success',
          title: 'Sync Completed',
          message: `${dev.deviceName} successfully synchronized ${res.syncedItemsCount} changes.`,
        });
      }, 1000);
    } catch {
      showToast({ type: 'error', title: 'Sync Request Failed' });
    }
  };

  // Action: Remote Logout
  const handleRemoteLogout = async (dev: PosDevice) => {
    try {
      const res = await posApi.remoteLogout(dev.id);
      setDevices(prev => prev.map(d => d.id === dev.id ? { ...d, status: 'IDLE' as any, currentCashier: 'Logged Out' } : d));
      showToast({
        type: 'warning',
        title: 'Remote Logout Dispatched',
        message: res.message,
      });
      if (selectedDevice?.id === dev.id) {
        setSelectedDevice(prev => prev ? { ...prev, status: 'IDLE' as any, currentCashier: 'Logged Out' } : null);
      }
    } catch {
      showToast({ type: 'error', title: 'Remote Logout Failed' });
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
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
              POS Terminal Fleet & Diagnostics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live checkout registers, peripheral hardware telemetry & remote terminal operations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            devices.forEach(d => handleRefreshStatus(d));
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh All Terminals</span>
        </button>
      </div>

      {/* POS FLEET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map(dev => (
          <div
            key={dev.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm hover:border-slate-300 transition-all"
          >
            {/* Header: Device Name, Status, Branch, Terminal ID */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {dev.deviceName}
                  </span>
                  <StatusBadge status={dev.status} />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  {dev.branchName} · Terminal ID: <strong className="text-slate-700 dark:text-slate-300">{dev.deviceId}</strong>
                </div>
              </div>
            </div>

            {/* Spec info: Cashier, App Version, Heartbeat, Last Sync */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Cashier:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{dev.currentCashier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">App Version:</span>
                <span className="text-emerald-600 font-bold">{dev.appVersion}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Last Heartbeat:</span>
                <span className="text-slate-700 dark:text-slate-300">{dev.lastActiveTime || '10s ago'}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Last Sync:</span>
                <span className="text-slate-700 dark:text-slate-300">{dev.lastSyncTime}</span>
              </div>
            </div>

            {/* Diagnostics: Printer, Scanner, Network, Database Sync */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              {/* Printer Status */}
              <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Printer className="w-3.5 h-3.5" />
                  Printer
                </span>
                <span className={`font-bold ${dev.printerStatus === 'Connected' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {dev.printerStatus}
                </span>
              </div>

              {/* Scanner Status */}
              <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <QrCode className="w-3.5 h-3.5" />
                  Scanner
                </span>
                <span className={`font-bold ${dev.scannerStatus === 'Connected' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {dev.scannerStatus}
                </span>
              </div>

              {/* Network Status */}
              <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Wifi className="w-3.5 h-3.5" />
                  Network
                </span>
                <span className="font-bold text-emerald-600">
                  {dev.status === 'OFFLINE' ? 'OFFLINE' : 'ONLINE (LAN)'}
                </span>
              </div>

              {/* Database Sync Status */}
              <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <HardDrive className="w-3.5 h-3.5" />
                  DB Sync
                </span>
                <span className="font-bold text-emerald-600">
                  {dev.pendingSyncBills === 0 ? 'SYNCED' : `${dev.pendingSyncBills} PENDING`}
                </span>
              </div>
            </div>

            {/* 4 ACTIONS: View Details, Refresh Status, Request Sync, Remote Logout */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedDevice(dev)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>View Details</span>
              </button>

              <button
                type="button"
                onClick={() => handleRefreshStatus(dev)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => handleRequestSync(dev)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                <span>Request Sync</span>
              </button>

              <button
                type="button"
                onClick={() => handleRemoteLogout(dev)}
                className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 transition-colors ml-auto"
                title="Remote Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DEVICE DETAILS MODAL */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <MonitorDot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{selectedDevice.deviceName}</span>
                    <StatusBadge status={selectedDevice.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Terminal ID: {selectedDevice.deviceId} · {selectedDevice.branchName}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDevice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">Terminal Specifications</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-400">Operating System:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDevice.os}</span></div>
                  <div><span className="text-slate-400">Local LAN IP:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDevice.ipAddress}</span></div>
                  <div><span className="text-slate-400">NEXUS App:</span> <span className="font-bold text-emerald-600">{selectedDevice.appVersion}</span></div>
                  <div><span className="text-slate-400">Current Cashier:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDevice.currentCashier}</span></div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">Hardware Peripheral Telemetry</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span>ESC/POS Thermal Receipt Printer:</span>
                    <span className="font-bold text-emerald-600">{selectedDevice.printerStatus} (80mm USB Direct)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2D CMOS QR / Barcode Scanner:</span>
                    <span className="font-bold text-emerald-600">{selectedDevice.scannerStatus} (HID USB Wedge)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Electronic Cash Till Solenoid:</span>
                    <span className="font-bold text-emerald-600">CONNECTED (RJ11 Kick)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">Synchronization & Cloud Link</div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between"><span>Last Sync Time:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDevice.lastSyncTime}</span></div>
                  <div className="flex justify-between"><span>Last Heartbeat:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDevice.lastActiveTime || '10s ago'}</span></div>
                  <div className="flex justify-between"><span>Cloud Backup:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDevice.lastBackupTime}</span></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleRequestSync(selectedDevice);
                    setSelectedDevice(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Request Full Catalog Sync</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRemoteLogout(selectedDevice);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Remote Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
