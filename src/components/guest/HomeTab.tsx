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
  Info,
  Car,
  Tv,
  ShieldAlert,
  Heart,
  Award,
  BedDouble,
  BookOpen,
  Calendar,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { QuickActionItem } from '../../types/guidebook';
import { defaultQuickActions, defaultHomeConfig } from '../../data/initialData';

const iconMap: Record<string, React.ElementType> = {
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
  Sparkles,
  Coffee,
  Info,
  Car,
  Tv,
  ShieldAlert,
  Heart,
  Award,
  BedDouble,
  BookOpen,
  Calendar,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Bell,
};

const getThemeClasses = (theme?: QuickActionItem['bgColor']) => {
  switch (theme) {
    case 'amber':
      return {
        boxBg: 'bg-amber-50 text-amber-800',
        hoverBox: 'group-hover:bg-[#c5a059] group-hover:text-white',
        borderHover: 'hover:border-[#c5a059]',
        bannerBg: 'bg-[#c5a059] text-[#14382c]',
      };
    case 'orange':
      return {
        boxBg: 'bg-orange-50 text-orange-800',
        hoverBox: 'group-hover:bg-orange-600 group-hover:text-white',
        borderHover: 'hover:border-orange-500',
        bannerBg: 'bg-orange-700 text-white',
      };
    case 'teal':
      return {
        boxBg: 'bg-teal-50 text-teal-800',
        hoverBox: 'group-hover:bg-teal-800 group-hover:text-white',
        borderHover: 'hover:border-teal-600',
        bannerBg: 'bg-teal-800 text-white',
      };
    case 'primary':
      return {
        boxBg: 'bg-[#14382c]/10 text-[#14382c]',
        hoverBox: 'group-hover:bg-[#14382c] group-hover:text-white',
        borderHover: 'hover:border-[#14382c]',
        bannerBg: 'bg-[#14382c] text-white',
      };
    case 'blue':
      return {
        boxBg: 'bg-blue-50 text-blue-800',
        hoverBox: 'group-hover:bg-blue-600 group-hover:text-white',
        borderHover: 'hover:border-blue-500',
        bannerBg: 'bg-blue-700 text-white',
      };
    case 'purple':
      return {
        boxBg: 'bg-purple-50 text-purple-800',
        hoverBox: 'group-hover:bg-purple-600 group-hover:text-white',
        borderHover: 'hover:border-purple-500',
        bannerBg: 'bg-purple-800 text-white',
      };
    case 'rose':
      return {
        boxBg: 'bg-rose-50 text-rose-800',
        hoverBox: 'group-hover:bg-rose-600 group-hover:text-white',
        borderHover: 'hover:border-rose-500',
        bannerBg: 'bg-rose-700 text-white',
      };
    case 'emerald':
    default:
      return {
        boxBg: 'bg-emerald-50 text-emerald-800',
        hoverBox: 'group-hover:bg-[#14382c] group-hover:text-white',
        borderHover: 'hover:border-emerald-600',
        bannerBg: 'bg-[#14382c] text-white',
      };
  }
};

export const HomeTab: React.FC = () => {
  const { hotelData, setActiveModal, setActiveTab } = useHotel();
  const { bulletin, contact, stayHours, wifi } = hotelData;

  const quickActions = (hotelData.quickActions && hotelData.quickActions.length > 0)
    ? hotelData.quickActions.filter(qa => qa.enabled !== false)
    : defaultQuickActions;

  const homeConfig = hotelData.homeConfig || defaultHomeConfig;
  const highlights = (homeConfig.highlights && homeConfig.highlights.length > 0)
    ? homeConfig.highlights.filter(h => h.enabled !== false)
    : defaultHomeConfig.highlights || [];

  const handleActionClick = (action: QuickActionItem) => {
    if (action.actionType === 'modal') {
      setActiveModal(action.actionPayload as any);
    } else if (action.actionType === 'tab') {
      setActiveTab(action.actionPayload as any);
    } else if (action.actionType === 'tel') {
      const num = action.actionPayload.startsWith('tel:') ? action.actionPayload : `tel:${action.actionPayload}`;
      window.location.href = num;
    } else if (action.actionType === 'link') {
      window.open(action.actionPayload, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-5 pb-6 text-slate-800">
      {/* 1. Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#14382c]/15 bg-[#14382c]">
        <div className="relative h-64 sm:h-72 w-full">
          <img
            src={hotelData.heroImage || '/images/ballykisteen_resort_hero_1790677395754.jpg'}
            alt={hotelData.name}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('ballykisteen_resort_hero')) {
                target.src = '/images/ballykisteen_resort_hero_1790677395754.jpg';
              }
            }}
          />
          {/* Measured Scrim for Media Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
          
          {/* Top Tag & Eircode Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 bg-[#14382c]/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              {hotelData.logoImage ? (
                <img
                  src={hotelData.logoImage}
                  alt="Hotel Logo"
                  className="w-4 h-4 rounded-full object-cover border border-[#c5a059]"
                />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              )}
              <span className="font-semibold tracking-wide">
                {homeConfig.starRatingText || '4-Star Resort'}
              </span>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] font-mono text-white/90">
              {contact.eircode}
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            {hotelData.logoImage && (
              <div className="mb-2">
                <img
                  src={hotelData.logoImage}
                  alt="Resort Logo"
                  className="h-8 max-w-[120px] object-contain rounded-md drop-shadow-md bg-black/30 backdrop-blur-xs p-1 border border-white/10"
                />
              </div>
            )}
            <div className="text-[#c5a059] text-xs font-semibold tracking-widest uppercase mb-1">
              {homeConfig.welcomeSubtitle || 'Welcome to Tipperary'}
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
            <span>{homeConfig.checkInStripText || `Check-in: ${stayHours.checkIn.replace('From ', '')}`}</span>
          </div>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{homeConfig.wifiStripText || `Wi-Fi: ${wifi.ssid}`}</span>
          </div>
        </div>
      </div>

      {/* 2. Resort Quick Actions (Dynamic Grid & Full-Width Banners) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Resort Quick Actions
          </h2>
          <span className="text-[11px] text-[#14382c] font-semibold">One-Tap Access</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map(action => {
            const Icon = iconMap[action.iconName] || Sparkles;
            const theme = getThemeClasses(action.bgColor);

            // Full-Width Banner Action (e.g. Call Front Desk or Featured Alert)
            if (action.isFullWidth) {
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className={`col-span-2 w-full flex items-center justify-between p-3.5 rounded-2xl ${
                    action.bgColor === 'primary' ? 'bg-[#14382c] text-white hover:bg-[#1c4a3a]' :
                    action.bgColor === 'amber' ? 'bg-[#c5a059] text-[#14382c] hover:bg-[#d4af37]' :
                    'bg-[#14382c] text-white hover:bg-[#1c4a3a]'
                  } shadow-xs transition-all active:scale-[0.98] text-left group`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                      action.bgColor === 'primary' ? 'bg-[#c5a059] text-[#14382c]' :
                      action.bgColor === 'amber' ? 'bg-[#14382c] text-[#c5a059]' :
                      'bg-white/20 text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold leading-tight flex items-center gap-1.5 flex-wrap">
                        <span className="truncate">{action.title}</span>
                        {action.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${
                            action.bgColor === 'amber' ? 'bg-black/10 text-[#14382c]' : 'bg-white/15 text-[#c5a059]'
                          }`}>
                            {action.badge}
                          </span>
                        )}
                      </div>
                      {action.subtitle && (
                        <div className={`text-[11px] truncate mt-0.5 ${
                          action.bgColor === 'amber' ? 'text-[#14382c]/80' : 'text-white/70'
                        }`}>
                          {action.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    action.bgColor === 'amber' ? 'text-[#14382c]' : 'text-[#c5a059]'
                  }`} />
                </button>
              );
            }

            // Standard Tile Action (Half-Width Card)
            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={`flex flex-col items-start p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs ${theme.borderHover} hover:shadow-md transition-all text-left active:scale-[0.98] group relative`}
              >
                {action.badge && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {action.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl ${theme.boxBg} flex items-center justify-center mb-2.5 ${theme.hoverBox} transition-colors shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-xs text-slate-900 leading-tight">
                  {action.title}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {action.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Today's Resort Bulletin (Configurable) */}
      {homeConfig.bulletinEnabled !== false && (
        <div className="bg-[#f8f6f0] rounded-3xl p-4 sm:p-5 border border-[#c5a059]/25 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <h3 className="font-serif text-base font-bold text-[#14382c]">
                {homeConfig.bulletinTitle || "Today's Resort Bulletin"}
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {homeConfig.bulletinLocation || 'Limerick Junction'}
            </span>
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
                {bulletin.golfCourseStatus.split('·')[0] || 'Course Open'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {bulletin.golfCourseStatus}
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
      )}

      {/* 4. Resort Highlights & Promotional Cards (Configurable & Swappable) */}
      {highlights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {homeConfig.highlightsTitle || 'Resort Highlights'}
            </h2>
            <button
              onClick={() => setActiveTab('guide')}
              className="text-[11px] font-semibold text-[#14382c] hover:underline"
            >
              {homeConfig.highlightsSubtitle || 'Explore all guides →'}
            </button>
          </div>

          {highlights.map(card => {
            const handleCardClick = () => {
              if (card.actionType === 'tab') {
                setActiveTab(card.actionPayload as any);
              } else if (card.actionType === 'modal') {
                setActiveModal(card.actionPayload as any);
              } else if (card.actionType === 'link') {
                window.open(card.actionPayload, '_blank', 'noopener,noreferrer');
              }
            };

            return (
              <div 
                key={card.id}
                onClick={handleCardClick}
                className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="relative h-36">
                  <img 
                    src={card.image || '/images/ballykisteen_resort_hero_1790677395754.jpg'} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/ballykisteen_resort_hero_1790677395754.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    {card.badge && (
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#c5a059] block mb-0.5">
                        {card.badge}
                      </span>
                    )}
                    <h4 className="font-serif text-lg font-bold leading-tight">
                      {card.title}
                    </h4>
                  </div>
                </div>
                <div className="p-3.5 text-xs text-slate-600 flex items-center justify-between">
                  <span className="line-clamp-1">{card.subtitle}</span>
                  <span className="text-[#14382c] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                    {card.actionLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Google / TripAdvisor Review Callout (Configurable) */}
      {homeConfig.reviewCard?.enabled !== false && (
        <div className="p-4 rounded-3xl bg-linear-to-br from-[#14382c] to-[#1c4a3a] text-white shadow-md flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-white ml-1">
                {homeConfig.reviewCard?.rating || '4.5 / 5.0'}
              </span>
            </div>
            <p className="text-xs text-white/90 font-serif">
              {homeConfig.reviewCard?.title || 'Enjoying your stay at Ballykisteen?'}
            </p>
            <p className="text-[11px] text-white/70">
              {homeConfig.reviewCard?.subtitle || 'Share your feedback on Google Maps reviews.'}
            </p>
          </div>
          <a
            href={homeConfig.reviewCard?.reviewUrl || "https://www.google.com/maps/place/Great+National+Ballykisteen+Golf+Hotel/@52.502931,-8.204561,15z"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#c5a059] text-[#14382c] text-xs font-bold shrink-0 hover:bg-[#d4af37] active:scale-95 transition-all shadow-xs"
          >
            {homeConfig.reviewCard?.buttonText || 'Review Us'}
          </a>
        </div>
      )}

      {/* 6. Address & Contact Bar (Configurable) */}
      {homeConfig.locationBar?.enabled !== false && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-[#14382c] shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 truncate">{contact.address}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {homeConfig.locationBar?.eircodeNote || `Eircode: ${contact.eircode} · N24 Route`}
              </div>
            </div>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Great+National+Ballykisteen+Golf+Hotel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#14382c] hover:underline shrink-0 ml-2"
          >
            {homeConfig.locationBar?.mapsButtonText || 'Maps →'}
          </a>
        </div>
      )}
    </div>
  );
};
