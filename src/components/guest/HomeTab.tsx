import React from 'react';
import { 
  Wifi, 
  KeyRound, 
  Utensils, 
  Waves, 
  Phone, 
  Sun, 
  Flag, 
  Star, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Coffee,
  Info
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const HomeTab: React.FC = () => {
  const { hotelData, setActiveModal, setActiveTab } = useHotel();
  const { bulletin, contact, stayHours, wifi } = hotelData;

  return (
    <div className="space-y-5 pb-6 text-slate-800">
      {/* 1. Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#14382c]/15 bg-[#14382c]">
        <div className="relative h-64 sm:h-72 w-full">
          <img
            src={hotelData.heroImage}
            alt="Great National Ballykisteen Golf Hotel & Leisure Club"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Measured Scrim for Media Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
          
          {/* Top Tag & Eircode Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-1.5 bg-[#14382c]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="font-semibold tracking-wide">4-Star Resort</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] font-mono text-white/90">
              {contact.eircode}
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-[#c5a059] text-xs font-semibold tracking-widest uppercase mb-1">
              Welcome to Tipperary
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {hotelData.name}
            </h1>
            <p className="text-xs text-white/80 mt-1 line-clamp-1">
              {hotelData.tagline}
            </p>
          </div>
        </div>

        {/* Quick Strip info */}
        <div className="bg-[#102b22] px-4 py-2.5 flex items-center justify-between text-xs text-white/80 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Check-in: {stayHours.checkIn.replace('From ', '')}</span>
          </div>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Wi-Fi: {wifi.ssid}</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Grid (5 prominent touch-optimized buttons) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Resort Quick Actions
          </h2>
          <span className="text-[11px] text-[#14382c] font-semibold">One-Tap Access</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Wi-Fi Connect */}
          <button
            onClick={() => setActiveModal('wifi')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#c5a059] hover:shadow-md transition-all text-left active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:bg-[#14382c] group-hover:text-white transition-colors">
              <Wifi className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-900 leading-tight">
              Wi-Fi Connect
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              1-tap copy & QR scan
            </span>
          </button>

          {/* Check-in & Room Key */}
          <button
            onClick={() => setActiveModal('roomKey')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#c5a059] hover:shadow-md transition-all text-left active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-2.5 group-hover:bg-[#c5a059] group-hover:text-white transition-colors">
              <KeyRound className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-900 leading-tight">
              Check-in & Keys
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Arrivals & baggage
            </span>
          </button>

          {/* Junction One Dining */}
          <button
            onClick={() => setActiveModal('dining')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#c5a059] hover:shadow-md transition-all text-left active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center mb-2.5 group-hover:bg-orange-700 group-hover:text-white transition-colors">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-900 leading-tight">
              Junction One Dining
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Carvery, dinner & drinks
            </span>
          </button>

          {/* Golf & Leisure */}
          <button
            onClick={() => setActiveModal('leisure')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#c5a059] hover:shadow-md transition-all text-left active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mb-2.5 group-hover:bg-teal-800 group-hover:text-white transition-colors">
              <Waves className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-900 leading-tight">
              Pool, Spa & Golf
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Timetable & gym access
            </span>
          </button>
        </div>

        {/* 5th Action: Full-width Front Desk call */}
        <a
          href={`tel:${contact.receptionPhone}`}
          className="mt-2.5 w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#14382c] text-white shadow-xs hover:bg-[#1c4a3a] transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5a059] text-[#14382c] flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                <span>Call Front Desk Reception</span>
                <span className="text-[10px] text-[#c5a059] bg-white/10 px-1.5 py-0.5 rounded-sm">24/7 Ext. 0</span>
              </div>
              <div className="text-[11px] text-white/70">
                Direct hotel assistance & room service order
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#c5a059]" />
        </a>
      </div>

      {/* 3. Today's Resort Bulletin */}
      <div className="bg-[#f8f6f0] rounded-3xl p-4 sm:p-5 border border-[#c5a059]/25 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <h3 className="font-serif text-base font-bold text-[#14382c]">
              Today's Resort Bulletin
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Limerick Junction</span>
        </div>

        {/* Weather & Golf Condition */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{bulletin.weatherTemp}</span>
            </div>
            <p className="font-medium text-slate-800 text-[11px] leading-tight">
              {bulletin.weatherCondition}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              {bulletin.weatherNote}
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
              <Flag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Golf Course</span>
            </div>
            <p className="font-medium text-slate-800 text-[11px] leading-tight">
              Course Open
            </p>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              Greens fast · Buggies permitted
            </p>
          </div>
        </div>

        {/* Breakfast & Daily Special */}
        <div className="space-y-2 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/70 flex items-start gap-2.5">
            <Coffee className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <strong className="text-[#14382c] block font-semibold">Breakfast Service</strong>
              <span className="text-slate-600">{bulletin.breakfastStatus}</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/70 flex items-start gap-2.5">
            <Utensils className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <strong className="text-[#14382c] block font-semibold">Chef's Today Special</strong>
              <span className="text-slate-600">{bulletin.todaysSpecial}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Resort Features Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Resort Highlights
          </h2>
          <button
            onClick={() => setActiveTab('guide')}
            className="text-[11px] font-semibold text-[#14382c] hover:underline"
          >
            Explore all guides →
          </button>
        </div>

        {/* Championship Golf Course Card */}
        <div 
          onClick={() => setActiveTab('guide')}
          className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="relative h-36">
            <img 
              src={hotelData.golfImage} 
              alt="Championship Golf Course" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#c5a059] block mb-0.5">
                Des Smyth Design · 18 Holes
              </span>
              <h4 className="font-serif text-lg font-bold leading-tight">
                Championship Parkland Golf
              </h4>
            </div>
          </div>
          <div className="p-3.5 text-xs text-slate-600 flex items-center justify-between">
            <span>Preferential green fees for hotel residents</span>
            <span className="text-[#14382c] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Book Tee Time →
            </span>
          </div>
        </div>

        {/* Junction One Dining Card */}
        <div 
          onClick={() => setActiveModal('dining')}
          className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="relative h-36">
            <img 
              src={hotelData.diningImage} 
              alt="Junction One Dining" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#c5a059] block mb-0.5">
                Irish Seasonal Cuisine
              </span>
              <h4 className="font-serif text-lg font-bold leading-tight">
                Junction One Bar & Restaurant
              </h4>
            </div>
          </div>
          <div className="p-3.5 text-xs text-slate-600 flex items-center justify-between">
            <span>Carvery lunch, dinner & afternoon tea</span>
            <span className="text-[#14382c] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View Menus →
            </span>
          </div>
        </div>
      </div>

      {/* 5. Google Review Callout */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-[#14382c] to-[#1c4a3a] text-white shadow-md flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-white ml-1">4.5 / 5.0</span>
          </div>
          <p className="text-xs text-white/90 font-serif">
            Enjoying your stay at Ballykisteen?
          </p>
          <p className="text-[11px] text-white/70">
            Share your feedback on Google Maps reviews.
          </p>
        </div>
        <a
          href="https://www.google.com/maps/place/Great+National+Ballykisteen+Golf+Hotel/@52.502931,-8.204561,15z"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-[#c5a059] text-[#14382c] text-xs font-bold shrink-0 hover:bg-[#d4af37] active:scale-95 transition-all shadow-xs"
        >
          Review Us
        </a>
      </div>

      {/* 6. Address & Contact Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#14382c] shrink-0" />
          <div>
            <div className="font-semibold text-slate-800">{contact.address}</div>
            <div className="text-[11px] text-slate-500">Eircode: {contact.eircode} · N24 Route</div>
          </div>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Great+National+Ballykisteen+Golf+Hotel"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#14382c] hover:underline shrink-0"
        >
          Maps →
        </a>
      </div>
    </div>
  );
};
