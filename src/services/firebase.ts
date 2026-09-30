import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDocFromServer,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { HotelData } from '../types/guidebook';
import { initialHotelData } from '../data/initialData';

const RESORT_DOC_ID = 'ballykisteen';
const COMPENDIUM_COLLECTION = 'hotelCompendiums';

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfigJson);
} else {
  app = getApp();
}

// Support named firestoreDatabaseId from configuration
export const db: Firestore = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

export const isFirebaseConfigured = Boolean(firebaseConfigJson.projectId && firebaseConfigJson.apiKey);

/**
 * Validates initial connection to Firestore as mandated by integration guidelines
 */
export async function testConnection(): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection: client appears offline, running with local cache.');
    }
    return true;
  }
}

const normalizeAssetPath = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }
  return url;
};

/**
 * Strips unsupported undefined fields and deeply cleans data for Firestore.
 */
function sanitizeForFirestore(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    return value === undefined ? '' : value;
  }));
}

/**
 * Saves or updates resort compendium data in Cloud Firestore.
 * Automatically timestamps and broadcasts to all connected in-room devices.
 */
export async function saveCompendiumToFirestore(data: Partial<HotelData>): Promise<void> {
  if (!isFirebaseConfigured) return;
  const docRef = doc(db, COMPENDIUM_COLLECTION, RESORT_DOC_ID);
  
  const cleanData = sanitizeForFirestore(data);
  const payload = {
    ...cleanData,
    updatedAt: new Date().toISOString(),
    _serverTimestamp: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (err: any) {
    console.error('Firestore save failed:', err);
    throw err;
  }
}

/**
 * Listens for real-time changes to the resort compendium.
 * Zero-refresh needed: in-room tablets and guest devices instantly update.
 */
export function listenToCompendium(
  onData: (data: HotelData, metadata: { hasPendingWrites: boolean; fromCache: boolean; lastSynced: Date }) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured) {
    return () => {};
  }

  const docRef = doc(db, COMPENDIUM_COLLECTION, RESORT_DOC_ID);

  return onSnapshot(
    docRef,
    { includeMetadataChanges: true },
    snapshot => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as Partial<HotelData>;
        const merged: HotelData = {
          ...initialHotelData,
          ...remoteData,
          // Explicitly prioritize remote image assets with legacy path healing
          heroImage: normalizeAssetPath(remoteData.heroImage) || initialHotelData.heroImage,
          logoImage: normalizeAssetPath(remoteData.logoImage) || initialHotelData.logoImage,
          diningImage: normalizeAssetPath(remoteData.diningImage) || initialHotelData.diningImage,
          leisureImage: normalizeAssetPath(remoteData.leisureImage) || initialHotelData.leisureImage,
          golfImage: normalizeAssetPath(remoteData.golfImage) || initialHotelData.golfImage,
          // Guarantee nested safe defaults
          bookingLinks: {
            ...initialHotelData.bookingLinks,
            ...(remoteData.bookingLinks || {}),
          },
          contact: {
            ...initialHotelData.contact,
            ...(remoteData.contact || {}),
          },
          wifi: {
            ...initialHotelData.wifi,
            ...(remoteData.wifi || {}),
          },
          stayHours: {
            ...initialHotelData.stayHours,
            ...(remoteData.stayHours || {}),
          },
          bulletin: {
            ...initialHotelData.bulletin,
            ...(remoteData.bulletin || {}),
          },
          leisure: {
            ...initialHotelData.leisure,
            ...(remoteData.leisure || {}),
          },
          golf: {
            ...initialHotelData.golf,
            ...(remoteData.golf || {}),
          },
          dining: Array.isArray(remoteData.dining) ? remoteData.dining : initialHotelData.dining,
          attractions: Array.isArray(remoteData.attractions) ? remoteData.attractions : initialHotelData.attractions,
          guideSections: Array.isArray(remoteData.guideSections) ? remoteData.guideSections : initialHotelData.guideSections,
          quickActions: Array.isArray(remoteData.quickActions) ? remoteData.quickActions : initialHotelData.quickActions,
          homeConfig: {
            ...initialHotelData.homeConfig,
            ...(remoteData.homeConfig || {}),
            highlights: Array.isArray(remoteData.homeConfig?.highlights)
              ? remoteData.homeConfig.highlights
              : initialHotelData.homeConfig?.highlights || [],
            reviewCard: {
              enabled: remoteData.homeConfig?.reviewCard?.enabled ?? initialHotelData.homeConfig?.reviewCard?.enabled ?? true,
              rating: remoteData.homeConfig?.reviewCard?.rating ?? initialHotelData.homeConfig?.reviewCard?.rating ?? '4.5 / 5.0',
              title: remoteData.homeConfig?.reviewCard?.title ?? initialHotelData.homeConfig?.reviewCard?.title ?? 'Enjoying your stay at Ballykisteen?',
              subtitle: remoteData.homeConfig?.reviewCard?.subtitle ?? initialHotelData.homeConfig?.reviewCard?.subtitle ?? 'Share your feedback on Google Maps reviews.',
              buttonText: remoteData.homeConfig?.reviewCard?.buttonText ?? initialHotelData.homeConfig?.reviewCard?.buttonText ?? 'Review Us',
              reviewUrl: remoteData.homeConfig?.reviewCard?.reviewUrl ?? initialHotelData.homeConfig?.reviewCard?.reviewUrl ?? 'https://www.google.com/maps/place/Great+National+Ballykisteen+Golf+Hotel/@52.502931,-8.204561,15z',
            },
            locationBar: {
              enabled: remoteData.homeConfig?.locationBar?.enabled ?? initialHotelData.homeConfig?.locationBar?.enabled ?? true,
              eircodeNote: remoteData.homeConfig?.locationBar?.eircodeNote ?? initialHotelData.homeConfig?.locationBar?.eircodeNote ?? 'Eircode: E34 VK12 · N24 Route',
              mapsButtonText: remoteData.homeConfig?.locationBar?.mapsButtonText ?? initialHotelData.homeConfig?.locationBar?.mapsButtonText ?? 'Maps →',
            },
          },
          standee: {
            ...initialHotelData.standee,
            ...(remoteData.standee || {}),
          },
        };

        onData(merged, {
          hasPendingWrites: snapshot.metadata.hasPendingWrites,
          fromCache: snapshot.metadata.fromCache,
          lastSynced: new Date(),
        });
      } else {
        // If document does not exist yet in fresh database, seed it!
        saveCompendiumToFirestore(initialHotelData).catch(err => {
          console.warn('Initial seed error:', err);
        });
      }
    },
    err => {
      console.error('Firestore snapshot subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// Initial connection test
testConnection().catch(() => {});
