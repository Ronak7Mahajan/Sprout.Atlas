import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import { allProduceItems } from '../src/data/produceCatalog.ts';

const firebaseConfig = {
  apiKey: "AIzaSyALM6Ae3BEb8UsOwZr1ghVEhS61Q-_aJZc",
  authDomain: "sprout-atlas.firebaseapp.com",
  projectId: "sprout-atlas",
  storageBucket: "sprout-atlas.firebasestorage.app",
  messagingSenderId: "483151439105",
  appId: "1:483151439105:web:5336ac86045433b4462700",
  measurementId: "G-KQX658EH26"
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seed() {
  console.log(`🌿 Starting Firestore seeding for Sprout Atlas...`);
  console.log(`🔑 Authenticating session with Firebase...`);
  try {
    await signInAnonymously(auth);
    console.log(`🔒 Authenticated successfully as UID: ${auth.currentUser?.uid}`);
  } catch (authErr) {
    console.log(`ℹ️ Anonymous auth step:`, authErr);
  }
  console.log(`📦 Total produce specimens to upload: ${allProduceItems.length}`);

  const batchSize = 100;
  let totalUploaded = 0;

  for (let i = 0; i < allProduceItems.length; i += batchSize) {
    const chunk = allProduceItems.slice(i, i + batchSize);
    const batch = writeBatch(db);

    for (const item of chunk) {
      const docRef = doc(db, 'produce_catalog', item.id.toString());
      batch.set(
        docRef,
        {
          ...item,
          uploadedAt: new Date().toISOString(),
          version: '1.0.0',
        },
        { merge: true }
      );
    }

    try {
      await batch.commit();
      totalUploaded += chunk.length;
      console.log(`✅ Uploaded batch ${Math.floor(i / batchSize) + 1} (${totalUploaded}/${allProduceItems.length} items)...`);
    } catch (err) {
      console.error(`❌ Batch failed at index ${i}:`, err);
    }
  }

  console.log(`🎉 Finished! Successfully seeded ${totalUploaded}/${allProduceItems.length} produces into Firestore collection 'produce_catalog'.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
