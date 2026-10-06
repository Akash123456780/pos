import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  KeyRound, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_INFO } from '../../data/mockData';

export const LoginView: React.FC = () => {
  const { 
    login, 
    loginWithBiometrics, 
    verifyPin, 
    verifyOtp,
    rememberDevice, 
    setRememberDevice 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'pin' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('rajesh@nexusmart.in');
  const [password, setPassword] = useState('nexus@2026');
  const [showPassword, setShowPassword] = useState(false);
  
  // PIN state
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  
  // OTP state
  const [otpValue, setOtpValue] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await login(identifier, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricClick = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const ok = await loginWithBiometrics();
      if (!ok) setErrorMsg('Biometric authentication cancelled.');
    } catch {
      setErrorMsg('Biometric sensor unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (pinStr: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const ok = await verifyPin(pinStr);
      if (!ok) {
        setErrorMsg('Invalid 4-digit PIN. (Demo PIN: 1234)');
        setPinDigits(['', '', '', '']);
      }
    } catch {
      setErrorMsg('PIN verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = val.slice(-1);
    setPinDigits(newDigits);

    // auto focus next
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    if (newDigits.every(d => d !== '')) {
      handlePinSubmit(newDigits.join(''));
    }
  };

  const handleSendOtp = () => {
    setIsOtpSent(true);
    setOtpValue('123456'); // pre-fill demo OTP
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await verifyOtp(otpValue);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 text-white select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Brand Banner */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-600 items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20 mb-3">
            NX
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white font-sans">
            NEXUS OWNER
          </h2>
          <p className="text-xs font-mono text-emerald-400 mt-1 uppercase tracking-widest font-semibold">
            {BUSINESS_INFO.planName}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Welcome back, Owner · <span className="text-slate-200 font-medium">{BUSINESS_INFO.name}</span>
          </p>
        </div>

        {/* Card Box */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          
          {/* Method Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl mb-6 text-xs font-medium">
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                authMode === 'password' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('pin'); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                authMode === 'pin' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Security PIN
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setErrorMsg(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                authMode === 'otp' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Instant OTP
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MODE 1: PASSWORD LOGIN */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="e.g. +91 98450 12890 or owner@nexusmart.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Owner Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Password reset instructions dispatched to registered mobile: +91 98450 12890');
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={e => setRememberDevice(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In as Owner'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: PIN LOGIN */}
          {authMode === 'pin' && (
            <div className="py-2 text-center space-y-4">
              <div className="text-xs text-slate-400">
                Enter your 4-digit Master Owner PIN to unlock store access
              </div>

              <div className="flex justify-center gap-3 my-4">
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`pin-${idx}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={e => handlePinDigitChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                ))}
              </div>

              <p className="text-[11px] text-slate-500 font-mono">
                Default Demo PIN: 1234
              </p>

              <button
                type="button"
                onClick={() => handlePinSubmit(pinDigits.join(''))}
                disabled={isLoading || pinDigits.some(d => d === '')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs sm:text-sm text-white shadow-lg transition-all disabled:opacity-50"
              >
                Unlock Terminal
              </button>
            </div>
          )}

          {/* MODE 3: OTP LOGIN */}
          {authMode === 'otp' && (
            <div className="py-1 space-y-4">
              {!isOtpSent ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    A secure one-time passcode will be sent to the business owner&apos;s registered mobile (+91 98450 12890).
                  </p>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs sm:text-sm text-white shadow-lg transition-all"
                  >
                    Send OTP to Mobile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Enter 6-digit OTP sent to +91 98450 12890
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={e => setOtpValue(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs sm:text-sm text-white shadow-lg transition-all"
                  >
                    Verify & Access Dashboard
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Change Mobile Number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* BIOMETRIC QUICK BUTTON */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleBiometricClick}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
            >
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              <span>Biometric Login (Face ID / Fingerprint)</span>
            </button>
          </div>

        </div>

        {/* Security verification stamp */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>AES-256 Encrypted Session · Device Verified</span>
        </div>

      </div>
    </div>
  );
};
