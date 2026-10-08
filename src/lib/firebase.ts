import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  writeBatch,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyALM6Ae3BEb8UsOwZr1ghVEhS61Q-_aJZc",
  authDomain: "sprout-atlas.firebaseapp.com",
  projectId: "sprout-atlas",
  storageBucket: "sprout-atlas.firebasestorage.app",
  messagingSenderId: "483151439105",
  appId: "1:483151439105:web:5336ac86045433b4462700",
  measurementId: "G-KQX658EH26"
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics safely (only in supported browser environments)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure in sandboxed or ad-blocked environments
  });
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Helper functions for Authentication
export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function loginWithEmail(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass);
}

export async function registerWithEmail(email: string, pass: string) {
  return createUserWithEmailAndPassword(auth, email, pass);
}

export async function loginAnonymously() {
  return signInAnonymously(auth);
}

export async function logOut() {
  return fbSignOut(auth);
}

// Cloud Persistence helpers for user data
export async function saveUserDataToCloud(uid: string, data: Record<string, any>) {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...data, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save to Firestore:', err);
    return false;
  }
}

export async function loadUserDataFromCloud(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Failed to load from Firestore:', err);
    return null;
  }
}

// Batch upload all produces to the 'produce_catalog' collection in Firestore
export async function seedAllProducesToFirestore(
  produces: any[],
  onProgress?: (uploadedCount: number, totalCount: number) => void
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    // Ensure we have an active auth session if rules require it
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (authErr) {
        console.warn('Anonymous auth prior to seed skipped/failed:', authErr);
      }
    }

    const batchSize = 100;
    let uploaded = 0;

    for (let i = 0; i < produces.length; i += batchSize) {
      const chunk = produces.slice(i, i + batchSize);
      const batch = writeBatch(db);

      for (const item of chunk) {
        const itemRef = doc(db, 'produce_catalog', item.id.toString());
        batch.set(
          itemRef,
          {
            ...item,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }

      await batch.commit();
      uploaded += chunk.length;
      if (onProgress) {
        onProgress(uploaded, produces.length);
      }
    }

    return { success: true, count: uploaded };
  } catch (err: any) {
    console.error('Error seeding produce catalog to Firestore:', err);
    return { success: false, count: 0, error: err?.message || String(err) };
  }
}

// Fetch all produce items from Firestore if available
export async function fetchProducesFromFirestore(): Promise<any[] | null> {
  try {
    const colRef = collection(db, 'produce_catalog');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return null;

    const items: any[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data());
    });
    return items.sort((a, b) => (a.id || 0) - (b.id || 0));
  } catch (err) {
    console.warn('Failed to query produce_catalog from Firestore:', err);
    return null;
  }
}

export { onAuthStateChanged, type FirebaseUser };
