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

// TODO: Replace with your Firebase config or use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Vote version types
export type VoteVersion =
  | "hoy-por-ser-tu-cumpleaños"
  | "hoy-por-ser-dia-de-tu-santo"
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

export interface SignatureData {
  id?: string;
  name: string;
  reason: string;
  country: string;
  timestamp: any;
}

// Submit a vote
export async function submitVote(version: VoteVersion): Promise<void> {
  try {
    // Add vote to votes collection
    // NOTE: Statistics are now updated via a Cloud Function for security.
    // Do not attempt to update statistics directly from the client.
    await addDoc(collection(db, "votes"), {
      version,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
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
        "otras-variaciones": 0,
      },
      lastUpdated: null,
    };
  } catch (error) {
    console.error("Error getting statistics:", error);
    return null;
  }
}

// Submit a petition signature
export async function submitSignature(data: Omit<SignatureData, 'timestamp'>): Promise<void> {
  try {
    await addDoc(collection(db, "signatures"), {
      ...data,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error submitting signature:", error);
    throw error;
  }
}

// Get recent signatures
export async function getSignatures(limitCount: number = 10): Promise<SignatureData[]> {
  const placeholders: SignatureData[] = [
    {
      id: 'placeholder-1',
      name: 'Juan Pérez',
      country: 'MÉXICO',
      reason: 'Porque mi tía siempre empieza con "el día de tu santo" y yo con "tu cumpleaños". ¡Es un caos!',
      timestamp: { seconds: Date.now() / 1000 }
    },
    {
      id: 'placeholder-2',
      name: 'María García',
      country: 'ESPAÑA',
      reason: 'En España ni sabemos qué es el santo en la canción, ¡ayuda! Queremos una versión universal.',
      timestamp: { seconds: (Date.now() / 1000) - 3600 }
    },
    {
      id: 'placeholder-3',
      name: 'Carlos Ruiz',
      country: 'MÉXICO',
      reason: 'El tercer verso es un campo de batalla. Necesitamos paz y una sola letra.',
      timestamp: { seconds: (Date.now() / 1000) - 7200 }
    },
    {
      id: 'placeholder-4',
      name: 'Elena Torres',
      country: 'COLOMBIA',
      reason: 'En Colombia también la cantamos y siempre hay alguien que se adelanta al "despierta". ¡Justicia!',
      timestamp: { seconds: (Date.now() / 1000) - 14400 }
    },
    {
      id: 'placeholder-5',
      name: 'Roberto Gómez',
      country: 'MÉXICO',
      reason: 'Mi abuelo la canta en una versión que nadie más conoce. ¡Es hora de estandarizar!',
      timestamp: { seconds: (Date.now() / 1000) - 28800 }
    },
    {
      id: 'placeholder-6',
      name: 'Sofía Martínez',
      country: 'ARGENTINA',
      reason: '¡Queremos una versión estándar para las fiestas internacionales! Saludos desde el sur.',
      timestamp: { seconds: (Date.now() / 1000) - 43200 }
    },
    {
      id: 'placeholder-7',
      name: 'Diego López',
      country: 'MÉXICO',
      reason: 'Ya basta de la confusión entre el Rey David y el cumpleañero. ¡Firmado!',
      timestamp: { seconds: (Date.now() / 1000) - 86400 }
    }
  ];

  try {
    const querySnapshot = await getDocs(collection(db, "signatures"));
    const signatures: SignatureData[] = [];
    querySnapshot.forEach((doc) => {
      signatures.push({ id: doc.id, ...doc.data() } as SignatureData);
    });
    
    // If no signatures in DB, return placeholders
    if (signatures.length === 0) {
      return placeholders.slice(0, limitCount);
    }

    // Sort by timestamp descending and limit
    return signatures
      .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error getting signatures, returning placeholders:", error);
    return placeholders.slice(0, limitCount);
  }
}

// Export db for advanced usage
export { db };
