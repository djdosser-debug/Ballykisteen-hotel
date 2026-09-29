import React, { useState } from 'react';
import { 
  KeyRound, 
  Utensils, 
  Flag, 
  Waves, 
  Tv, 
  ShieldAlert, 
  ChevronDown, 
  Phone, 
  Wifi, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { GuideSection } from '../../types/guidebook';

const iconMap: Record<string, React.ElementType> = {
  KeyRound,
  Utensils,
  Flag,
  Waves,
  Tv,
  ShieldAlert,
};

export const GuidebookTab: React.FC = () => {
  const { hotelData, setActiveModal } = useHotel();
  const [expandedSection, setExpandedSection] = useState<string>('check-in-departure');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? '' : id));
  };

  return (
    <div className="space-y-4 pb-6 text-slate-800">
      {/* Header */}
      <div className="bg-[#14382c] text-white p-5 rounded-3xl relative overflow-hidden shadow-md">
        <div className="relative z-10">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#c5a059] mb-1">
            Resident Directory & Services
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Resort Guidebook
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-sm">
            Everything you need for an exceptional stay at Ballykisteen. Tap any section to view full resort guidelines.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#c5a059]/10 pointer-events-none" />
      </div>

      {/* Accordion Categories */}
      <div className="space-y-2.5">
        {hotelData.guideSections.map((section: GuideSection) => {
          const Icon = iconMap[section.iconName] || KeyRound;
          const isExpanded = expandedSection === section.id;

          return (
            <div
              key={section.id}
              className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                isExpanded
                  ? 'bg-white border-[#14382c]/30 shadow-md ring-1 ring-[#14382c]/10'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Category Header Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-[#14382c] text-[#c5a059]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                        {section.title}
                      </h3>
                      {section.badge && (
                        <span className="text-[10px] font-semibold text-[#14382c] bg-[#14382c]/10 px-2 py-0.5 rounded-full shrink-0">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {section.items.length} topics & guidelines
                    </span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 bg-[#14382c]/10 text-[#14382c]' : 'text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#f8f6f0]/70 rounded-xl border border-slate-200/70 space-y-1.5"
                    >
                      <h4 className="font-semibold text-xs text-[#14382c] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                        {item.heading}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed pl-3">
                        {item.details}
                      </p>
                    </div>
                  ))}

                  {/* Contextual Action depending on category */}
                  {section.id === 'check-in-departure' && (
                    <button
                      onClick={() => setActiveModal('roomKey')}
                      className="w-full py-2.5 rounded-xl bg-[#14382c] text-white text-xs font-semibold hover:bg-[#1c4a3a] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>View Check-in & Keycard Guidance</span>
                    </button>
                  )}

                  {section.id === 'dining-room-service' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setActiveModal('dining')}
                        className="py-2.5 px-3 rounded-xl bg-[#14382c] text-white text-xs font-semibold hover:bg-[#1c4a3a] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Utensils className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>Dining Menus</span>
                      </button>
                      <a
                        href={`tel:${hotelData.contact.receptionPhone}`}
                        className="py-2.5 px-3 rounded-xl bg-orange-700 text-white text-xs font-semibold hover:bg-orange-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Order Room Service</span>
                      </a>
                    </div>
                  )}

                  {section.id === 'golf-course-guide' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${hotelData.contact.golfPhone}`}
                        className="py-2.5 px-3 rounded-xl bg-[#14382c] text-white text-xs font-semibold hover:bg-[#1c4a3a] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>Call Pro Shop</span>
                      </a>
                      <a
                        href={hotelData.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Tee Times Online</span>
                      </a>
                    </div>
                  )}

                  {section.id === 'leisure-spa-guide' && (
                    <button
                      onClick={() => setActiveModal('leisure')}
                      className="w-full py-2.5 rounded-xl bg-[#14382c] text-white text-xs font-semibold hover:bg-[#1c4a3a] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Waves className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>View Pool & Spa Timetable</span>
                    </button>
                  )}

                  {section.id === 'room-amenities' && (
                    <button
                      onClick={() => setActiveModal('wifi')}
                      className="w-full py-2.5 rounded-xl bg-[#14382c] text-white text-xs font-semibold hover:bg-[#1c4a3a] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Wifi className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Connect to Wi-Fi</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
