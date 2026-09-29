import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Lock, 
  Unlock, 
  Printer, 
  Sparkles, 
  Share2, 
  Radio, 
  Compass, 
  BookOpen, 
  Search,
  ExternalLink
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export const TopDeviceBar: React.FC = () => {
  const { 
    hotelData,
    viewMode, 
    setViewMode, 
    appMode, 
    setAppMode, 
    setActiveModal, 
    isHostAuthenticated, 
    logoutHost,
    showToast 
  } = useHotel();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateIrishTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-IE', {
          timeZone: 'Europe/Dublin',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(new Date());
        setCurrentTime(timeStr);
      } catch {
        setCurrentTime('10:30');
      }
    };
    updateIrishTime();
    const interval = setInterval(updateIrishTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleHostToggle = () => {
    if (appMode === 'host') {
      setAppMode('guest');
      showToast('Switched to Guest Experience');
    } else {
      if (isHostAuthenticated) {
        setAppMode('host');
        showToast('Host Management Console active');
      } else {
        setActiveModal('hostLogin');
      }
    }
  };

  const handleShareGuidebook = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Great National Ballykisteen Golf Hotel - Digital Welcome Guide',
          text: 'Explore resort dining, pool timetables, golf tee times, and Tipperary attractions.',
          url: window.location.href,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Guidebook link copied to clipboard');
    }
  };

  return (
    <header className="no-print w-full bg-[#0a1711] text-white border-b border-[#14382c]/80 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          {hotelData.logoImage ? (
            <img
              src={hotelData.logoImage}
              alt="Logo"
              className="w-7 h-7 rounded-lg object-contain bg-white/10 p-0.5 border border-white/20"
            />
          ) : (
            <span className="text-[#c5a059]">✦</span>
          )}
          <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white flex items-center gap-1.5">
            Ballykisteen
          </span>
          <div className="hidden lg:flex items-center gap-2 text-xs text-white/50 pl-2 border-l border-white/10">
            <span>Tipperary</span>
            <span aria-hidden="true">·</span>
            <span>Local {currentTime} IST</span>
          </div>
        </div>

        {/* Zone 2: Device switcher & Mode Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Frame Switcher: Mobile vs Desktop */}
          <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'mobile'
                  ? 'bg-[#14382c] text-[#c5a059] shadow-xs font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
              title="Switch to 420px mobile view"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile 420px</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'desktop'
                  ? 'bg-[#14382c] text-[#c5a059] shadow-xs font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
              title="Expand to responsive desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full View</span>
            </button>
          </div>

          {/* Live Sync Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>Live Sync Active</span>
          </div>
        </div>

        {/* Zone 3: Actions (Print Standee & Host Mode) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Printable Standee Button */}
          <button
            onClick={() => setActiveModal('standee')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 transition-colors active:scale-98"
            title="Generate printable table tent standee with QR code"
          >
            <Printer className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">QR Standee</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareGuidebook}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
            title="Share Guidebook Link"
            aria-label="Share Guidebook"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Host Management Toggle */}
          <button
            onClick={handleHostToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-98 ${
              appMode === 'host'
                ? 'bg-[#c5a059] text-[#0a1711] shadow-xs hover:bg-[#d4af37]'
                : isHostAuthenticated
                ? 'bg-[#14382c] text-white border border-[#c5a059]/40 hover:bg-[#1c4a3a]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            {appMode === 'host' ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Host Console</span>
              </>
            ) : isHostAuthenticated ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="hidden xs:inline">Host Portal</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-white/70" />
                <span className="hidden xs:inline">Host Login</span>
              </>
            )}
          </button>

          {/* If authenticated in host mode, quick lock/logout */}
          {isHostAuthenticated && appMode === 'host' && (
            <button
              onClick={logoutHost}
              className="px-2 py-1 text-[11px] text-white/70 hover:text-white underline hover:no-underline"
              title="Lock & Logout Host Session"
            >
              Lock
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
