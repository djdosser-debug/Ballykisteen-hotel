import React, { useState, useEffect } from 'react';
import { Wifi, Copy, Check, X, ShieldCheck, Smartphone, Info } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { generateQrDataUrl, buildWifiQrString } from '../../utils/qrCode';

export const WifiModal: React.FC = () => {
  const { hotelData, activeModal, setActiveModal, showToast } = useHotel();
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');

  const isOpen = activeModal === 'wifi';

  useEffect(() => {
    if (!isOpen) return;
    const wifiString = buildWifiQrString(
      hotelData.wifi.ssid,
      hotelData.wifi.password,
      hotelData.wifi.security,
      hotelData.wifi.hidden
    );
    generateQrDataUrl(wifiString, { width: 360, darkColor: '#14382c' }).then(url => {
      setQrUrl(url);
    });
  }, [isOpen, hotelData.wifi]);

  if (!isOpen) return null;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(hotelData.wifi.password);
    setCopied(true);
    showToast('Wi-Fi Password copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#14382c]/10 text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wifi-modal-title"
      >
        {/* Header */}
        <div className="bg-[#14382c] px-6 py-5 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-1 text-[#c5a059]">
            <Wifi className="w-5 h-5" />
            <span className="text-xs font-semibold tracking-wider uppercase">High-Speed Guest Wi-Fi</span>
          </div>
          <h2 id="wifi-modal-title" className="text-xl font-serif font-bold text-white tracking-wide">
            Connect to Resort Network
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* QR Code Card */}
          <div className="bg-[#f8f6f0] p-4 rounded-2xl border border-[#c5a059]/20 flex flex-col items-center text-center">
            {qrUrl ? (
              <img 
                src={qrUrl} 
                alt="Wi-Fi QR Code" 
                className="w-44 h-44 rounded-xl shadow-xs bg-white p-2"
              />
            ) : (
              <div className="w-44 h-44 bg-white/70 rounded-xl flex items-center justify-center animate-pulse">
                <Wifi className="w-8 h-8 text-[#14382c]/30" />
              </div>
            )}
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#14382c]">
              <Smartphone className="w-4 h-4 text-[#c5a059]" />
              <span>Scan with phone camera to connect instantly</span>
            </div>
          </div>

          {/* Credentials Display */}
          <div className="space-y-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Network Name (SSID)
              </div>
              <div className="text-base font-semibold text-[#14382c] select-all">
                {hotelData.wifi.ssid}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Password
                </div>
                <div className="text-base font-mono font-bold text-slate-900 tracking-wider truncate select-all">
                  {hotelData.wifi.password}
                </div>
              </div>
              <button
                onClick={handleCopyPassword}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-[#14382c] text-white hover:bg-[#1c4a3a] active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Help Note */}
          <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-900/10">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Unlimited complimentary fiber Wi-Fi. For assistance connecting laptops or gaming consoles, dial <strong>Ext. 0</strong> from your room phone.
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 rounded-xl font-medium text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
