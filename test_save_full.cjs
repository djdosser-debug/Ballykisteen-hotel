const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, serverTimestamp } = require('firebase/firestore');
const config = require('./firebase-applet-config.json');

async function testFullSave() {
  console.log("Initializing test with full hotelData payload...");
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  // Read current document
  const docRef = doc(db, 'hotelCompendiums', 'ballykisteen');
  const snap = await getDoc(docRef);
  const currentData = snap.data();
  console.log("Current document keys:", Object.keys(currentData || {}));

  // Attempt to save an updated heroImage
  const newHeroImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
  const updatedData = {
    ...currentData,
    heroImage: newHeroImage,
    updatedAt: new Date().toISOString(),
    _serverTimestamp: serverTimestamp(),
  };

  console.log("Attempting setDoc with updated heroImage...");
  try {
    await setDoc(docRef, updatedData, { merge: true });
    console.log("SUCCESSFULLY SAVED TO FIRESTORE!");
    
    // Verify by reading back immediately
    const verifySnap = await getDoc(docRef);
    console.log("Verified heroImage:", verifySnap.data()?.heroImage);
    process.exit(0);
  } catch (err) {
    console.error("FAILED TO SAVE TO FIRESTORE:", err);
    process.exit(1);
  }
}

testFullSave().catch(e => {
  console.error("Top-level error:", e);
  process.exit(1);
});
