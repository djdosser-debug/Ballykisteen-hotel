import React from 'react';
import { Utensils, X, Clock, Phone, Award, ExternalLink } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const DiningReserveModal: React.FC = () => {
  const { hotelData, activeModal, setActiveModal } = useHotel();

  if (activeModal !== 'dining') return null;

  const { dining, contact } = hotelData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#14382c]/10 text-slate-800 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dining-modal-title"
      >
        {/* Banner */}
        <div className="relative h-44 bg-[#14382c] shrink-0">
          <img 
            src={hotelData.diningImage} 
            alt="Junction One Bar & Restaurant" 
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/90 hover:text-white hover:bg-black/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-1.5 text-[#c5a059] text-xs font-semibold uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" />
              <span>Award-Winning Tipperary Hospitality</span>
            </div>
            <h2 id="dining-modal-title" className="text-xl font-serif font-bold text-white">
              Junction One Bar & Restaurant
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Reserve / Room Service Bar */}
          <div className="bg-[#14382c] text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-[#c5a059] font-semibold uppercase tracking-wider">
                Table Reservations & Room Service
              </div>
              <div className="text-xs text-white/90 mt-0.5">
                Dial <strong>Ext. 0</strong> or book online
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hotelData.bookingLinks?.tableBookingUrl && (
                <a
                  href={hotelData.bookingLinks.tableBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white text-[#14382c] rounded-xl font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#14382c]" />
                  <span>Book Online</span>
                </a>
              )}
              <a
                href={`tel:${contact.receptionPhone}`}
                className="px-3 py-2 bg-[#c5a059] text-[#14382c] rounded-xl font-bold text-xs shrink-0 hover:bg-[#d4af37] flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Ext. 0</span>
              </a>
            </div>
          </div>

          {/* Menus list */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Daily Serving Schedule & Menus
            </h4>

            {dining.map(item => (
              <div 
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-[#f8f6f0]/60 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-serif font-bold text-sm text-[#14382c]">
                    {item.name}
                  </h5>
                  {item.highlight && (
                    <span className="text-[10px] font-medium text-[#c5a059] bg-[#14382c] px-2 py-0.5 rounded-full shrink-0">
                      {item.highlight}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-[#c5a059]" />
                  <span>{item.hours}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Room Service Delivery Note */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-start gap-2.5 text-slate-600">
            <Award className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold mb-0.5">Room Service Policy</strong>
              Room service is available from 12:00 PM to 9:30 PM daily. A tray delivery charge of €5 applies. Dial Ext. 0 on your telephone to place an order.
            </div>
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
