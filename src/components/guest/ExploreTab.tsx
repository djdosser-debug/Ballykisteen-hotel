import React from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Clock, 
  Sparkles, 
  ExternalLink,
  Car,
  Footprints
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Attraction } from '../../types/guidebook';

export const ExploreTab: React.FC = () => {
  const { hotelData, exploreFilter, setExploreFilter } = useHotel();

  const filterCategories = [
    { id: 'all', label: 'All Highlights' },
    { id: 'racing', label: 'Golf & Racing' },
    { id: 'dining', label: 'Dining & Pubs' },
    { id: 'historic', label: 'Historic Castles' },
    { id: 'nature', label: 'Scenic Nature' },
  ];

  const filteredAttractions = hotelData.attractions.filter(item => {
    if (exploreFilter === 'all') return true;
    if (exploreFilter === 'racing') return item.category === 'racing' || item.category === 'transport';
    return item.category === exploreFilter;
  });

  return (
    <div className="space-y-4 pb-6 text-slate-800">
      {/* Header */}
      <div className="bg-[#14382c] text-white p-5 rounded-3xl relative overflow-hidden shadow-md">
        <div className="relative z-10">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#c5a059] mb-1">
            Tipperary & Golden Vale
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Local Attractions & Map
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-sm">
            Curated points of interest, heritage sites, and dining within easy reach of Limerick Junction.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#c5a059]/10 pointer-events-none" />
      </div>

      {/* Category Filter Buttons (Interactive Segmented Bar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {filterCategories.map(cat => {
          const isActive = exploreFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setExploreFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-[#14382c] text-[#c5a059] font-semibold shadow-xs ring-1 ring-[#c5a059]/30'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Attractions List */}
      <div className="space-y-3.5">
        {filteredAttractions.map((attraction: Attraction) => {
          const isWalking = attraction.travelTime.includes('walk');
          return (
            <div
              key={attraction.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-2.5"
            >
              {/* Top Row: Title & Distance */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-bold text-slate-900 leading-snug">
                    {attraction.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 text-[#14382c] font-semibold">
                      {isWalking ? (
                        <Footprints className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Car className="w-3.5 h-3.5 text-blue-700" />
                      )}
                      <span>{attraction.travelTime}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{attraction.distanceKm}</span>
                  </div>
                </div>

                <a
                  href={attraction.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#14382c] text-white text-xs font-semibold hover:bg-[#1c4a3a] transition-all flex items-center gap-1.5 shrink-0 shadow-2xs active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Directions</span>
                </a>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {attraction.description}
              </p>

              {/* Insider Tip Box */}
              {attraction.insiderTip && (
                <div className="p-2.5 rounded-xl bg-[#f8f6f0] border border-[#c5a059]/25 text-xs text-slate-700 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="text-[#14382c] font-semibold mr-1">Insider Tip:</strong>
                    {attraction.insiderTip}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredAttractions.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
            <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No attractions found in this category</p>
            <button
              onClick={() => setExploreFilter('all')}
              className="mt-3 px-4 py-1.5 rounded-xl bg-[#14382c] text-white text-xs font-semibold"
            >
              Show all attractions
            </button>
          </div>
        )}
      </div>

      {/* Front desk local advice helper */}
      <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>Need custom road trip or taxi recommendations?</span>
        <a
          href={`tel:${hotelData.contact.receptionPhone}`}
          className="font-semibold text-[#14382c] hover:underline shrink-0"
        >
          Ask Front Desk Ext. 0
        </a>
      </div>
    </div>
  );
};
