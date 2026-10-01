import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, KeyRound, ShieldAlert } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const HostLoginModal: React.FC = () => {
  const { activeModal, setActiveModal, loginHost } = useHotel();
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

  const handleClose = () => {
    setActiveModal(null);
    setError(false);
    setPasscode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#14382c]/10 text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-login-title"
      >
        {/* Header */}
        <div className="bg-[#14382c] px-6 py-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-[#c5a059]">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Staff Access</span>
          </div>
          <h2 id="host-login-title" className="text-xl font-serif font-bold text-white tracking-wide">
            Host Management Login
          </h2>
        </div>

        {/* Form Body - Secure with NO password hints shown */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            This administration console is restricted to Ballykisteen resort management and staff. Enter the security passcode to proceed.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Security Passcode
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
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>Incorrect passcode. Access denied.</span>
              </div>
            )}
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
              onClick={handleClose}
              className="w-full py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
