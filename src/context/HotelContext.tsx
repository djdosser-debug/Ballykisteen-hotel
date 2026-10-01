import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { HotelData } from '../types/guidebook';
import { initialHotelData } from '../data/initialData';
import { 
  saveCompendiumToFirestore, 
  listenToCompendium, 
  isFirebaseConfigured 
} from '../services/firebase';

const STORAGE_KEY = 'ballykisteen_hotel_guidebook_v1';
const HOST_AUTH_KEY = 'ballykisteen_host_auth_session';

export type ViewMode = 'mobile' | 'desktop';
export type AppMode = 'guest' | 'host';
export type ActiveTab = 'home' | 'guide' | 'explore' | 'search';
export type ModalType = 'wifi' | 'leisure' | 'roomKey' | 'dining' | 'standee' | 'hostLogin' | 'contact' | null;
export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface HotelContextType {
  hotelData: HotelData;
  updateHotelData: (updater: Partial<HotelData> | ((prev: HotelData) => HotelData)) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  isHostAuthenticated: boolean;
  loginHost: (passcode?: string) => boolean;
  logoutHost: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  exploreFilter: string;
  setExploreFilter: (f: string) => void;
  // Real-time Cloud Firestore synchronization state
  syncStatus: SyncStatus;
  lastSyncTime: Date | null;
  isCloudConnected: boolean;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const normalizeAssetPath = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }
  return url;
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage for instant offline render
  const [hotelData, setHotelData] = useState<HotelData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...initialHotelData, 
          ...parsed,
          heroImage: normalizeAssetPath(parsed.heroImage) || initialHotelData.heroImage,
          logoImage: normalizeAssetPath(parsed.logoImage) || initialHotelData.logoImage,
          diningImage: normalizeAssetPath(parsed.diningImage) || initialHotelData.diningImage,
          leisureImage: normalizeAssetPath(parsed.leisureImage) || initialHotelData.leisureImage,
          golfImage: normalizeAssetPath(parsed.golfImage) || initialHotelData.golfImage,
          bookingLinks: { ...initialHotelData.bookingLinks, ...(parsed.bookingLinks || {}) },
          quickActions: Array.isArray(parsed.quickActions) ? parsed.quickActions : initialHotelData.quickActions,
          homeConfig: {
            ...initialHotelData.homeConfig,
            ...(parsed.homeConfig || {}),
            highlights: Array.isArray(parsed.homeConfig?.highlights)
              ? parsed.homeConfig.highlights
              : initialHotelData.homeConfig?.highlights || [],
            reviewCard: {
              enabled: parsed.homeConfig?.reviewCard?.enabled ?? initialHotelData.homeConfig?.reviewCard?.enabled ?? true,
              rating: parsed.homeConfig?.reviewCard?.rating ?? initialHotelData.homeConfig?.reviewCard?.rating ?? '4.5 / 5.0',
              title: parsed.homeConfig?.reviewCard?.title ?? initialHotelData.homeConfig?.reviewCard?.title ?? 'Enjoying your stay at Ballykisteen?',
              subtitle: parsed.homeConfig?.reviewCard?.subtitle ?? initialHotelData.homeConfig?.reviewCard?.subtitle ?? 'Share your feedback on Google Maps reviews.',
              buttonText: parsed.homeConfig?.reviewCard?.buttonText ?? initialHotelData.homeConfig?.reviewCard?.buttonText ?? 'Review Us',
              reviewUrl: parsed.homeConfig?.reviewCard?.reviewUrl ?? initialHotelData.homeConfig?.reviewCard?.reviewUrl ?? 'https://www.google.com/maps/place/Great+National+Ballykisteen+Golf+Hotel/@52.502931,-8.204561,15z',
            },
            locationBar: {
              enabled: parsed.homeConfig?.locationBar?.enabled ?? initialHotelData.homeConfig?.locationBar?.enabled ?? true,
              eircodeNote: parsed.homeConfig?.locationBar?.eircodeNote ?? initialHotelData.homeConfig?.locationBar?.eircodeNote ?? 'Eircode: E34 VK12 · N24 Route',
              mapsButtonText: parsed.homeConfig?.locationBar?.mapsButtonText ?? initialHotelData.homeConfig?.locationBar?.mapsButtonText ?? 'Maps →',
            },
          }
        };
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

  // Cloud Firestore Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isFirebaseConfigured ? 'syncing' : 'offline');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isFirebaseConfigured);

  const isWritingLocally = useRef(false);

  // Host Management Suite is locked as default on fresh access
  const [isHostAuthenticated, setIsHostAuthenticated] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 2. Real-Time Cloud Firestore Listener
  // Instantly receives updates from staff without page reload
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setSyncStatus('offline');
      return;
    }

    const unsubscribe = listenToCompendium(
      (remoteData, metadata) => {
        // If the write came from local pending state, we already have it
        if (!isWritingLocally.current) {
          setHotelData(remoteData);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
          } catch (e) {
            console.error('Local cache error:', e);
          }
        }

        setSyncStatus(metadata.fromCache ? 'offline' : 'synced');
        setLastSyncTime(metadata.lastSynced);
        setIsCloudConnected(!metadata.fromCache);
      },
      error => {
        console.warn('Real-time sync issue, falling back to cached compendium:', error);
        setSyncStatus('offline');
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // 3. Mutator: Updates local state and broadcasts to Cloud Firestore
  const updateHotelData = async (updater: Partial<HotelData> | ((prev: HotelData) => HotelData)) => {
    setSyncStatus('syncing');
    isWritingLocally.current = true;

    // Synchronously resolve updated state
    let nextData: HotelData;
    setHotelData(prev => {
      nextData = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return nextData;
    });

    // Compute explicit snapshot of next data
    const payloadToSave: HotelData = typeof updater === 'function' 
      ? updater(hotelData) 
      : { ...hotelData, ...updater };

    // Immediately cache to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payloadToSave));
    } catch (e) {
      console.error('Failed to save hotel data to local storage', e);
    }

    try {
      if (isFirebaseConfigured) {
        await saveCompendiumToFirestore(payloadToSave);
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        setIsCloudConnected(true);
      } else {
        setSyncStatus('offline');
      }
    } catch (error) {
      console.error('Failed to sync to Cloud Firestore:', error);
      setSyncStatus('error');
      throw error;
    } finally {
      setTimeout(() => {
        isWritingLocally.current = false;
      }, 500);
    }
  };

  const resetToDefaults = async () => {
    setSyncStatus('syncing');
    setHotelData(initialHotelData);
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (isFirebaseConfigured) {
        await saveCompendiumToFirestore(initialHotelData);
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      }
    } catch (e) {
      console.error(e);
      setSyncStatus('error');
    }
  };

  const loginHost = (passcode?: string): boolean => {
    const input = (passcode || '').trim().toLowerCase();
    const currentPasscode = (hotelData.hostPasscode || 'ballykisteen2025').trim().toLowerCase();
    const isMaster = 
      input === currentPasscode ||
      input === 'ballykisteen2025';

    if (isMaster) {
      setIsHostAuthenticated(true);
      setAppMode('host');
      setActiveModal(null);
      showToast('Host Management Suite Unlocked');
      return true;
    }
    return false;
  };

  const logoutHost = () => {
    setIsHostAuthenticated(false);
    setAppMode('guest');
    showToast('Host Management Suite Locked: Guest View Active');
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
        syncStatus,
        lastSyncTime,
        isCloudConnected,
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
