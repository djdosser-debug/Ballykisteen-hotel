import React from 'react';
import { Waves, X, Clock, AlertCircle, Phone, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const LeisurePoolModal: React.FC = () => {
  const { hotelData, activeModal, setActiveModal } = useHotel();

  if (activeModal !== 'leisure') return null;

  const { leisure, contact } = hotelData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#14382c]/10 text-slate-800 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leisure-modal-title"
      >
        {/* Banner with Image */}
        <div className="relative h-44 bg-[#14382c] shrink-0">
          <img 
            src={hotelData.leisureImage} 
            alt="Ballykisteen Pool and Spa"
            className="w-full h-full object-cover opacity-80"
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
            <div className="flex items-center gap-2 text-[#c5a059] text-xs font-semibold uppercase tracking-wider mb-1">
              <Waves className="w-4 h-4" />
              <span>Complimentary Guest Access</span>
            </div>
            <h2 id="leisure-modal-title" className="text-xl font-serif font-bold text-white">
              Leisure Club, Pool & Spa
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* Operating Hours */}
          <div className="bg-[#f8f6f0] p-4 rounded-2xl border border-[#c5a059]/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#14382c]">
              <Clock className="w-4 h-4 text-[#c5a059]" />
              <span>Opening Timetable</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Mon – Fri</span>
                <span className="font-semibold text-slate-900">{leisure.poolWeekdays}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Sat – Sun & Holidays</span>
                <span className="font-semibold text-slate-900">{leisure.poolWeekends}</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Children's Swim Times:</span>
                <span className="font-medium text-slate-800">{leisure.kidsSwimHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Adult-Only Peaceful Swim:</span>
                <span className="font-medium text-slate-800">{leisure.adultOnlyHours}</span>
              </div>
            </div>
          </div>

          {/* Swim Cap Notice */}
          <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Mandatory Swim Cap Policy</strong>
              In compliance with Irish leisure hygiene guidelines, all swimmers must wear a swimming cap in the pool. Silicone caps are available at the leisure reception desk for {leisure.swimCapPrice}.
            </div>
          </div>

          {/* Spa & Facilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resort Facilities</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Heated Indoor Pool</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Hydrotherapy Jacuzzi</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Finnish Wood Sauna</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Aromatherapy Steam</span>
              </div>
            </div>
          </div>

          {/* Spa Treatment Callout */}
          <div className="bg-[#14382c]/5 p-3.5 rounded-2xl border border-[#14382c]/10 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14382c]">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Ballykisteen Beauty Rooms</span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">
                Massages, organic seaweed facials & therapies
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hotelData.bookingLinks?.spaBookingUrl && (
                <a
                  href={hotelData.bookingLinks.spaBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a] flex items-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Book Online</span>
                </a>
              )}
              <a
                href={`tel:${contact.receptionPhone}`}
                className="px-3 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 flex items-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3 h-3" />
                <span>Call Ext. 0</span>
              </a>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-2.5 rounded-xl font-medium text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
