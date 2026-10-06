import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  KeyRound, 
  Fingerprint, 
  Smartphone, 
  Lock, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2, 
  History,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const SecurityCenterView: React.FC = () => {
  const { setSubView, showToast } = useApp();
  const { 
    biometricsEnabled, 
    toggleBiometrics, 
    logoutAllDevices, 
    setPin 
  } = useAuth();

  const [newPin, setNewPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [revokedCount, setRevokedCount] = useState<number | null>(null);

  const connectedDevices = [
    { name: 'Apple iPhone 15 Pro (Current App)', location: 'Bengaluru, India', ip: '157.48.21.90', lastActive: 'Active now', isCurrent: true },
    { name: 'Samsung Galaxy Tab S9 (Backoffice)', location: 'Indiranagar Main Store', ip: '192.168.1.104', lastActive: '2 hrs ago', isCurrent: false },
    { name: 'MacBook Air M2 (Chrome Browser)', location: 'Bengaluru, India', ip: '157.48.21.90', lastActive: 'Yesterday 18:30', isCurrent: false },
  ];

  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      showToast({ type: 'warning', title: 'PIN must be 4 digits' });
      return;
    }
    setPin(newPin);
    setIsChangingPin(false);
    setNewPin('');
    showToast({
      type: 'success',
      title: 'Master PIN Updated',
      message: 'New 4-digit security PIN saved to encrypted storage.',
    });
  };

  const handleLogoutOtherDevices = async () => {
    const count = await logoutAllDevices();
    setRevokedCount(count);
    showToast({
      type: 'success',
      title: 'Sessions Terminated',
      message: `Revoked ${count} remote device sessions.`,
    });
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
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
            Security & Device Protection
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Owner authorization credentials, biometric keys & active device sessions
          </p>
        </div>
      </div>

      {/* SECURITY STATUS BANNER */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              Account Security Status: High Protection
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
              Two-factor OTP enabled · Biometric authorization ready · 256-bit AES encryption
            </div>
          </div>
        </div>
        <span className="text-emerald-600 font-mono font-bold text-xs">VERIFIED</span>
      </div>

      {/* CREDENTIAL CONTROLS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-5">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
          Access & Credentials
        </h3>

        {/* Biometrics Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Biometric Login (Face ID / Fingerprint)
              </div>
              <div className="text-[11px] text-slate-400">
                Unlock NEXUS Owner immediately using native hardware biometric sensor
              </div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={biometricsEnabled}
              onChange={e => toggleBiometrics(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>

        {/* PIN Management */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Master Store PIN
                </div>
                <div className="text-[11px] text-slate-400">
                  Required to approve manual discounts, manager voids and refunds
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChangingPin(!isChangingPin)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              {isChangingPin ? 'Cancel' : 'Change Master PIN'}
            </button>
          </div>

          {isChangingPin && (
            <form onSubmit={handlePinUpdate} className="pt-2 flex items-center gap-2 border-t border-slate-200 dark:border-slate-700">
              <input
                type="password"
                maxLength={4}
                required
                placeholder="Enter new 4-digit PIN"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-center tracking-widest text-sm text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex-shrink-0"
              >
                Save New PIN
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CONNECTED DEVICES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
            Active Devices & Sessions ({connectedDevices.length})
          </h3>

          <button
            type="button"
            onClick={handleLogoutOtherDevices}
            className="text-xs text-rose-600 font-semibold hover:underline"
          >
            Logout Other Devices
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {connectedDevices.map((dev, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{dev.name}</span>
                    {dev.isCurrent && (
                      <span className="text-[10px] text-emerald-600 font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {dev.location} · IP: {dev.ip}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                {dev.lastActive}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
