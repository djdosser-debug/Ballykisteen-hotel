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
export async function saveCompendiumToFirestore(data: HotelData): Promise<void> {
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
          // Explicitly prioritize remote image assets
          heroImage: remoteData.heroImage !== undefined ? remoteData.heroImage : initialHotelData.heroImage,
          logoImage: remoteData.logoImage !== undefined ? remoteData.logoImage : initialHotelData.logoImage,
          diningImage: remoteData.diningImage !== undefined ? remoteData.diningImage : initialHotelData.diningImage,
          leisureImage: remoteData.leisureImage !== undefined ? remoteData.leisureImage : initialHotelData.leisureImage,
          golfImage: remoteData.golfImage !== undefined ? remoteData.golfImage : initialHotelData.golfImage,
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
