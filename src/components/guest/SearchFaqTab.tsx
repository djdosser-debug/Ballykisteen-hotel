import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  X, 
  Phone, 
  Wifi, 
  Utensils, 
  KeyRound, 
  Waves, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { FAQItem } from '../../types/guidebook';

export const SearchFaqTab: React.FC = () => {
  const { hotelData, searchQuery, setSearchQuery, setActiveModal } = useHotel();
  const [expandedFaq, setExpandedFaq] = useState<string>('faq-wifi-pass');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => (prev === id ? '' : id));
  };

  const query = searchQuery.trim().toLowerCase();

  // Search through FAQs
  const matchedFaqs = hotelData.faqs.filter(faq => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (!query) return true;
    return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
  });

  // Search through Guidebook Items
  const matchedGuideItems: { category: string; heading: string; details: string }[] = [];
  if (query) {
    hotelData.guideSections.forEach(section => {
      section.items.forEach(item => {
        if (
          item.heading.toLowerCase().includes(query) || 
          item.details.toLowerCase().includes(query) ||
          section.title.toLowerCase().includes(query)
        ) {
          matchedGuideItems.push({
            category: section.title,
            heading: item.heading,
            details: item.details,
          });
        }
      });
    });
  }

  // Search through Dining Items
  const matchedDining: typeof hotelData.dining = [];
  if (query) {
    hotelData.dining.forEach(item => {
      if (
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      ) {
        matchedDining.push(item);
      }
    });
  }

  const hasSearchResults = query.length > 0;
  const totalMatches = matchedFaqs.length + matchedGuideItems.length + matchedDining.length;

  const categories = ['all', 'Check-in', 'Wi-Fi', 'Dining', 'Golf & Leisure', 'Policies'];

  return (
    <div className="space-y-4 pb-6 text-slate-800">
      {/* Search Header */}
      <div className="bg-[#14382c] text-white p-5 rounded-3xl relative overflow-hidden shadow-md">
        <div className="relative z-10 space-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#c5a059] mb-1">
              Instant Knowledge Base
            </div>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
              Search & Guest FAQ
            </h2>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Wi-Fi, breakfast, checkout, pool..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#c5a059]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills for FAQs (when not searching or to filter FAQs) */}
      {!hasSearchResults && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#14382c] text-[#c5a059] font-semibold shadow-xs ring-1 ring-[#c5a059]/30'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Search Results View */}
      {hasSearchResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500">
              Found {totalMatches} result{totalMatches === 1 ? '' : 's'} for "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#14382c] font-semibold hover:underline"
            >
              Clear Search
            </button>
          </div>

          {/* Guidebook Section Matches */}
          {matchedGuideItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#14382c] px-1">
                Guidebook Articles
              </h3>
              {matchedGuideItems.map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[#14382c] bg-emerald-50 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <h4 className="font-semibold text-xs text-slate-900">
                      {item.heading}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Dining Matches */}
          {matchedDining.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#14382c] px-1">
                Dining Menus
              </h3>
              {matchedDining.map(item => (
                <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-xs text-slate-900">{item.name}</h4>
                    <span className="text-[10px] text-slate-500">{item.hours}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Matches */}
          {matchedFaqs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#14382c] px-1">
                Matched Questions
              </h3>
              {matchedFaqs.map(faq => (
                <div key={faq.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-[#14382c] bg-[#14382c]/10 px-2 py-0.5 rounded-full">
                      {faq.category}
                    </span>
                    <h4 className="font-semibold text-xs text-slate-900">{faq.question}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* No matches */}
          {totalMatches === 0 && (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                No matching information found
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Our front desk team is ready 24/7 to answer any custom question about your stay.
              </p>
              <a
                href={`tel:${hotelData.contact.receptionPhone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a]"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Call Front Desk Ext. 0</span>
              </a>
            </div>
          )}
        </div>
      ) : (
        /* Regular FAQ List */
        <div className="space-y-2.5">
          {matchedFaqs.map((faq: FAQItem) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-[#14382c]/30 shadow-md ring-1 ring-[#14382c]/10'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-semibold text-[#14382c] bg-[#14382c]/10 px-2 py-0.5 rounded-full inline-block mb-1">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-xs text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 bg-[#14382c]/10 text-[#14382c]' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-[#f8f6f0]/50 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
