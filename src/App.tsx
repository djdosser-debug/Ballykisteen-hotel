import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { TopDeviceBar } from './components/TopDeviceBar';
import { HomeTab } from './components/guest/HomeTab';
import { GuidebookTab } from './components/guest/GuidebookTab';
import { ExploreTab } from './components/guest/ExploreTab';
import { SearchFaqTab } from './components/guest/SearchFaqTab';
import { BottomNav } from './components/guest/BottomNav';
import { HostConsole } from './components/host/HostConsole';
import { WifiModal } from './components/modals/WifiModal';
import { LeisurePoolModal } from './components/modals/LeisurePoolModal';
import { RoomKeyModal } from './components/modals/RoomKeyModal';
import { DiningReserveModal } from './components/modals/DiningReserveModal';
import { PrintStandeeModal } from './components/modals/PrintStandeeModal';
import { HostLoginModal } from './components/modals/HostLoginModal';
import { Check, Info } from 'lucide-react';

const GuidebookAppContent: React.FC = () => {
  const { viewMode, appMode, activeTab, toast } = useHotel();

  return (
    <div className="min-h-screen bg-[#0d1c16] flex flex-col font-sans selection:bg-[#c5a059]/30 text-slate-800">
      {/* 1. Top Device & Controls Bar */}
      <div className="print:hidden">
        <TopDeviceBar />
      </div>

      {/* 2. Toast Notification */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#14382c] text-white px-4 py-2 rounded-2xl shadow-xl border border-[#c5a059]/40 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 print:hidden">
          <Check className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>{toast}</span>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 w-full print:hidden">
        {appMode === 'host' ? (
          /* Host Management View (Desktop/Responsive) */
          <div className="w-full max-w-4xl py-2">
            <HostConsole />
          </div>
        ) : viewMode === 'mobile' ? (
          /* Clean 420px Mobile View (Without Device Hardware Outline) */
          <div className="w-full max-w-[420px] bg-[#f8f6f0] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col my-auto h-[840px] max-h-[calc(100vh-5rem)]">
            {/* Scrollable Content Container */}
            <div
              id="guidebook-scroll-container"
              className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-4 space-y-4"
            >
              {activeTab === 'home' && <HomeTab />}
              {activeTab === 'guide' && <GuidebookTab />}
              {activeTab === 'explore' && <ExploreTab />}
              {activeTab === 'search' && <SearchFaqTab />}
            </div>

            {/* Sticky 4-Tab Bottom Bar */}
            <BottomNav />
          </div>
        ) : (
          /* Desktop / Expanded View */
          <div className="w-full max-w-4xl bg-[#f8f6f0] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col my-auto min-h-[780px]">
            <div
              id="guidebook-scroll-container"
              className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-5"
            >
              {activeTab === 'home' && <HomeTab />}
              {activeTab === 'guide' && <GuidebookTab />}
              {activeTab === 'explore' && <ExploreTab />}
              {activeTab === 'search' && <SearchFaqTab />}
            </div>

            {/* Sticky 4-Tab Bottom Bar */}
            <BottomNav />
          </div>
        )}
      </main>

      {/* 4. Global Modals */}
      <WifiModal />
      <LeisurePoolModal />
      <RoomKeyModal />
      <DiningReserveModal />
      <PrintStandeeModal />
      <HostLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <GuidebookAppContent />
    </HotelProvider>
  );
}
