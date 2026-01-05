// Firebase configuration and utilities
// IMPORTANT: Replace these values with your own Firebase project credentials
// Get them from: https://console.firebase.google.com/

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Vote version types
export type VoteVersion =
  | "hoy-por-ser-tu-cumpleaños"
  | "hoy-por-ser-dia-de-tu-santo"
  | "hoy-que-estas-de-cumpleaños"
  | "otras-variaciones";

export interface VoteData {
  version: VoteVersion;
  timestamp: any;
  userAgent: string;
}

export interface Statistics {
  totalVotes: number;
  versionCounts: Record<VoteVersion, number>;
  lastUpdated: any;
}

// Submit a vote
export async function submitVote(version: VoteVersion): Promise<void> {
  try {
    // Add vote to votes collection
    await addDoc(collection(db, "votes"), {
      version,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });

    // Update statistics
    await updateStatistics(version);
  } catch (error) {
    console.error("Error submitting vote:", error);
    throw error;
  }
}

// Update statistics after a vote
async function updateStatistics(version: VoteVersion): Promise<void> {
  const statsRef = doc(db, "statistics", "global");

  try {
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      const currentStats = statsDoc.data() as Statistics;
      const newCounts = { ...currentStats.versionCounts };
      newCounts[version] = (newCounts[version] || 0) + 1;

      await setDoc(statsRef, {
        totalVotes: currentStats.totalVotes + 1,
        versionCounts: newCounts,
        lastUpdated: serverTimestamp(),
      });
    } else {
      // Initialize statistics if they don't exist
      await setDoc(statsRef, {
        totalVotes: 1,
        versionCounts: {
          "hoy-por-ser-tu-cumpleaños":
            version === "hoy-por-ser-tu-cumpleaños" ? 1 : 0,
          "hoy-por-ser-dia-de-tu-santo":
            version === "hoy-por-ser-dia-de-tu-santo" ? 1 : 0,
          "hoy-que-estas-de-cumpleaños":
            version === "hoy-que-estas-de-cumpleaños" ? 1 : 0,
          "otras-variaciones": version === "otras-variaciones" ? 1 : 0,
        },
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating statistics:", error);
    throw error;
  }
}

// Get current statistics
export async function getStatistics(): Promise<Statistics | null> {
  try {
    const statsRef = doc(db, "statistics", "global");
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      return statsDoc.data() as Statistics;
    }

    // Return default statistics if none exist
    return {
      totalVotes: 0,
      versionCounts: {
        "hoy-por-ser-tu-cumpleaños": 0,
        "hoy-por-ser-dia-de-tu-santo": 0,
        "hoy-que-estas-de-cumpleaños": 0,
        "otras-variaciones": 0,
      },
      lastUpdated: null,
    };
  } catch (error) {
    console.error("Error getting statistics:", error);
    return null;
  }
}

// Export db for advanced usage
export { db };
