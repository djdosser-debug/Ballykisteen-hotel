import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, KeyRound, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const HostLoginModal: React.FC = () => {
  const { activeModal, setActiveModal, loginHost, hotelData } = useHotel();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(false);

  if (activeModal !== 'hostLogin') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginHost(passcode);
    if (!success) {
      setError(true);
    } else {
      setError(false);
      setPasscode('');
      setActiveModal(null);
    }
  };

  const handleQuickUnlock = () => {
    const code = hotelData.hostPasscode || 'ballykisteen2025';
    setPasscode(code);
    loginHost(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#14382c]/10 text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-login-title"
      >
        {/* Header */}
        <div className="bg-[#14382c] px-6 py-5 text-white relative">
          <button
            onClick={() => {
              setActiveModal(null);
              setError(false);
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-[#c5a059]">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Staff & Host Portal</span>
          </div>
          <h2 id="host-login-title" className="text-xl font-serif font-bold text-white tracking-wide">
            Host Management Login
          </h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter the administration passcode to configure guest Wi-Fi, dining specials, golf schedules, and print table standees.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Host Security Passcode
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter passcode..."
                className={`w-full pl-3.5 pr-10 py-3 rounded-xl border text-sm font-mono tracking-wider focus:outline-hidden transition-colors ${
                  error
                    ? 'border-red-500 focus:border-red-600 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-[#14382c] focus:ring-2 focus:ring-[#14382c]/10'
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 space-y-0.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Passcode not recognized</span>
                </div>
                <p className="text-[11px] text-red-600 pl-5">
                  Try default passcode: <strong className="font-mono">ballykisteen2025</strong>
                </p>
              </div>
            )}
          </div>

          {/* Quick Staff Helper Box */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <span className="font-semibold text-amber-900 block text-[11px]">Resort Passcode:</span>
              <code className="font-mono text-[#14382c] font-bold text-xs truncate block">
                {hotelData.hostPasscode || 'ballykisteen2025'}
              </code>
            </div>
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="text-xs font-bold text-white bg-[#14382c] hover:bg-[#1c4a3a] px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
            >
              <Sparkles className="w-3 h-3 text-[#c5a059]" />
              <span>Quick Unlock</span>
            </button>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#14382c] text-white font-semibold text-sm hover:bg-[#1c4a3a] transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
            >
              <KeyRound className="w-4 h-4 text-[#c5a059]" />
              <span>Unlock Host Console</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
