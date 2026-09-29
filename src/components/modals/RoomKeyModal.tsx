import React from 'react';
import { KeyRound, X, Clock, Car, Luggage, Phone, ShieldCheck } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const RoomKeyModal: React.FC = () => {
  const { hotelData, activeModal, setActiveModal } = useHotel();

  if (activeModal !== 'roomKey') return null;

  const { stayHours, contact } = hotelData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#14382c]/10 text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="roomkey-modal-title"
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
          <div className="flex items-center gap-2 mb-1 text-[#c5a059]">
            <KeyRound className="w-5 h-5" />
            <span className="text-xs font-semibold tracking-wider uppercase">Guest Services</span>
          </div>
          <h2 id="roomkey-modal-title" className="text-xl font-serif font-bold text-white tracking-wide">
            Check-in & Room Guidance
          </h2>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Times */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#f8f6f0] p-3 rounded-2xl border border-[#c5a059]/20">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#14382c]" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Check-In Time</span>
              </div>
              <div className="text-sm font-bold text-[#14382c]">
                {stayHours.checkIn}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Photo ID & payment card required</p>
            </div>

            <div className="bg-[#f8f6f0] p-3 rounded-2xl border border-[#c5a059]/20">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#14382c]" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Check-Out Time</span>
              </div>
              <div className="text-sm font-bold text-[#14382c]">
                {stayHours.checkOut}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Express key drop available</p>
            </div>
          </div>

          {/* Keycard information */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900 block mb-0.5">Physical RFID Keycards</strong>
                <p className="text-slate-600 leading-relaxed">
                  Your electronic RFID keycard grants access to your guestroom, leisure club gates, and the night entrance after 23:00.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200">
              <Luggage className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900 block mb-0.5">Luggage Drop & Secure Hold</strong>
                <p className="text-slate-600 leading-relaxed">
                  Arriving early or staying after checkout? Leave your luggage with the front desk for complimentary locked storage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200">
              <Car className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900 block mb-0.5">Complimentary Resort Parking</strong>
                <p className="text-slate-600 leading-relaxed">
                  200+ free spaces with EV fast chargers located adjacent to the main leisure entrance.
                </p>
              </div>
            </div>
          </div>

          {/* Dial Front Desk */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-900/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-medium text-emerald-950">24/7 Front Reception</span>
            </div>
            <a
              href={`tel:${contact.receptionPhone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a]"
            >
              <Phone className="w-3 h-3" />
              <span>Dial Reception</span>
            </a>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-2.5 rounded-xl font-medium text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
