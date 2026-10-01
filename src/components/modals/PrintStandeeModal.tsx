import React, { useState, useEffect } from 'react';
import { Printer, X, Wifi, QrCode, Sparkles, Check, Download } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { generateQrDataUrl, buildWifiQrString } from '../../utils/qrCode';

export const PrintStandeeModal: React.FC = () => {
  const { hotelData, activeModal, setActiveModal, updateHotelData, showToast } = useHotel();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrMode, setQrMode] = useState<'guidebook' | 'wifi'>('guidebook');
  const [standeeSize, setStandeeSize] = useState<'a4' | 'tent_5x7'>('tent_5x7');

  const isOpen = activeModal === 'standee';

  useEffect(() => {
    if (!isOpen) return;

    let targetGuidebookUrl = window.location.origin + window.location.pathname;
    if (hotelData.standee.customUrl && hotelData.standee.customUrl.trim() !== '') {
      targetGuidebookUrl = hotelData.standee.customUrl.trim();
    }

    let payload = targetGuidebookUrl;
    if (qrMode === 'wifi') {
      payload = buildWifiQrString(
        hotelData.wifi.ssid,
        hotelData.wifi.password,
        hotelData.wifi.security,
        hotelData.wifi.hidden
      );
    }

    generateQrDataUrl(payload, { width: 500, margin: 1, darkColor: '#14382c' }).then(url => {
      setQrCodeUrl(url);
    });
  }, [isOpen, qrMode, hotelData.wifi, hotelData.standee.customUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto print:bg-transparent print:p-0 print:static print:overflow-visible">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-slate-800 my-auto print:shadow-none print:border-none print:max-w-none print:rounded-none print:w-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="standee-modal-title"
      >
        {/* Modal Controls Header */}
        <div className="bg-[#14382c] px-6 py-4 text-white flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 id="standee-modal-title" className="text-base font-serif font-bold text-white leading-tight">
                Guest Table QR Standee Studio
              </h2>
              <p className="text-[11px] text-white/70">
                Print luxury guestroom & dining table tent cards with instant camera scan
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Controls (Top Bar) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">QR Code Encodes:</span>
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg">
              <button
                onClick={() => setQrMode('guidebook')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  qrMode === 'guidebook' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Guidebook URL
              </button>
              <button
                onClick={() => setQrMode('wifi')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  qrMode === 'wifi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Direct Wi-Fi Join
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Card Format:</span>
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg">
              <button
                onClick={() => setStandeeSize('tent_5x7')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  standeeSize === 'tent_5x7' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5" × 7" Table Tent
              </button>
              <button
                onClick={() => setStandeeSize('a4')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  standeeSize === 'a4' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A4 Poster Frame
              </button>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="ml-auto px-4 py-2 bg-[#14382c] text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 hover:bg-[#1c4a3a] transition-transform active:scale-98 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Print Standee Now</span>
          </button>
        </div>

        {/* Printable Standee Sheet Container */}
        <div className="p-6 bg-slate-200/60 overflow-y-auto max-h-[65vh] flex justify-center print:p-0 print:bg-transparent print:overflow-visible print:max-h-none">
          <div 
            id="printable-standee-card"
            className={`bg-[#f8f6f0] border-4 border-[#14382c] rounded-2xl shadow-xl text-center relative flex flex-col justify-between transition-all duration-300 ${
              standeeSize === 'tent_5x7' 
                ? 'w-[360px] min-h-[520px] p-6' 
                : 'w-[480px] min-h-[640px] p-8'
            }`}
          >
            {/* Elegant Double Border Accent */}
            <div className="absolute inset-2 border border-[#c5a059]/50 rounded-xl pointer-events-none" />

            {/* Header / Crest */}
            <div className="pt-2 z-10 flex flex-col items-center">
              {hotelData.logoImage ? (
                <img
                  src={hotelData.logoImage}
                  alt="Hotel Logo"
                  className="h-12 max-w-[140px] object-contain mb-2.5 rounded-lg border border-[#c5a059]/40 bg-white p-1"
                />
              ) : (
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#14382c] text-[#c5a059] mb-3 shadow-sm border border-[#c5a059]/40">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
              <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c5a059] mb-1">
                Great National
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#14382c] tracking-tight leading-tight">
                Ballykisteen
              </h3>
              <p className="text-[11px] font-medium text-slate-600 tracking-wider uppercase mt-0.5">
                Golf Hotel & Leisure Club · Tipperary
              </p>
            </div>

            {/* Middle Section: Big QR Code */}
            <div className="my-4 flex flex-col items-center justify-center z-10">
              <div className="p-3 bg-white rounded-2xl border-2 border-[#14382c]/20 shadow-md">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Standee QR Code"
                    className={standeeSize === 'tent_5x7' ? 'w-44 h-44' : 'w-52 h-52'}
                  />
                ) : (
                  <div className="w-44 h-44 bg-slate-100 flex items-center justify-center animate-pulse">
                    <QrCode className="w-10 h-10 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="mt-3 max-w-[280px]">
                <p className="font-serif text-sm font-semibold text-[#14382c]">
                  {qrMode === 'guidebook' ? 'Scan for Digital Resort Guidebook' : 'Scan to Connect to Resort Wi-Fi'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {qrMode === 'guidebook'
                    ? 'Explore dining menus, pool timetable, golf tee times, and Tipperary attractions.'
                    : 'Point your camera at this QR code to automatically connect without typing.'}
                </p>
              </div>
            </div>

            {/* Bottom Section: Wi-Fi Credentials Badge */}
            {hotelData.standee.showWifiBox && (
              <div className="bg-white/90 border border-[#c5a059]/40 rounded-xl p-3 z-10 shadow-xs mb-2">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#14382c] mb-1.5">
                  <Wifi className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Complimentary Fiber Wi-Fi</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs divide-x divide-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Network (SSID)</span>
                    <strong className="text-[#14382c] font-semibold text-[11px]">{hotelData.wifi.ssid}</strong>
                  </div>
                  <div className="pl-2">
                    <span className="text-[10px] text-slate-500 block uppercase">Password</span>
                    <strong className="text-slate-900 font-mono font-bold text-[11px]">{hotelData.wifi.password}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-[9px] text-slate-400 tracking-wider uppercase z-10">
              Limerick Junction · Ext. 0 for Reception · Enjoy Your Stay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
