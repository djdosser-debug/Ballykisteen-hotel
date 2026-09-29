import React, { createContext, useContext, useState, useEffect } from 'react';
import { HotelData } from '../types/guidebook';
import { initialHotelData } from '../data/initialData';

const STORAGE_KEY = 'ballykisteen_hotel_guidebook_v1';
const HOST_AUTH_KEY = 'ballykisteen_host_auth_session';

export type ViewMode = 'mobile' | 'desktop';
export type AppMode = 'guest' | 'host';
export type ActiveTab = 'home' | 'guide' | 'explore' | 'search';
export type ModalType = 'wifi' | 'leisure' | 'roomKey' | 'dining' | 'standee' | 'hostLogin' | 'contact' | null;

interface HotelContextType {
  hotelData: HotelData;
  updateHotelData: (updater: Partial<HotelData> | ((prev: HotelData) => HotelData)) => void;
  resetToDefaults: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  isHostAuthenticated: boolean;
  loginHost: (passcode: string) => boolean;
  logoutHost: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  exploreFilter: string;
  setExploreFilter: (f: string) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotelData, setHotelData] = useState<HotelData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...initialHotelData, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved hotel data', e);
    }
    return initialHotelData;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [appMode, setAppMode] = useState<AppMode>('guest');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exploreFilter, setExploreFilter] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);

  const [isHostAuthenticated, setIsHostAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(HOST_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateHotelData = (updater: Partial<HotelData> | ((prev: HotelData) => HotelData)) => {
    setHotelData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save hotel data', e);
      }
      return next;
    });
  };

  const resetToDefaults = () => {
    setHotelData(initialHotelData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Hotel guidebook restored to official defaults');
  };

  const loginHost = (passcode: string): boolean => {
    if (passcode.trim() === hotelData.hostPasscode) {
      setIsHostAuthenticated(true);
      try {
        sessionStorage.setItem(HOST_AUTH_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      setAppMode('host');
      setActiveModal(null);
      showToast('Host Management unlocked');
      return true;
    }
    return false;
  };

  const logoutHost = () => {
    setIsHostAuthenticated(false);
    try {
      sessionStorage.removeItem(HOST_AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
    setAppMode('guest');
    showToast('Logged out of Host Management');
  };

  return (
    <HotelContext.Provider
      value={{
        hotelData,
        updateHotelData,
        resetToDefaults,
        viewMode,
        setViewMode,
        appMode,
        setAppMode,
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        isHostAuthenticated,
        loginHost,
        logoutHost,
        toast,
        showToast,
        searchQuery,
        setSearchQuery,
        exploreFilter,
        setExploreFilter,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
