// Firebase configuration & sync layer
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc,
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut,
  onAuthStateChanged 
} from 'firebase/auth';

// User's Firebase Project Configuration
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDTEgeF6GJ0x17Ht6N8W4Z5HE0VomZkkcU",
  authDomain: "stumas-17f5f.firebaseapp.com",
  projectId: "stumas-17f5f",
  storageBucket: "stumas-17f5f.firebasestorage.app",
  messagingSenderId: "152101959949",
  appId: "1:152101959949:web:43770b75f545f766135844"
};

export const getStoredFirebaseConfig = () => {
  const custom = localStorage.getItem('absensiswa_firebase_config');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch {
      // ignore
    }
  }
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId
  };
};

let app = null;
let db = null;
let auth = null;
let isFirebaseActive = false;

export const initFirebase = (config = null) => {
  const currentConfig = config || getStoredFirebaseConfig();
  if (currentConfig && currentConfig.apiKey && currentConfig.projectId) {
    try {
      app = getApps().length === 0 ? initializeApp(currentConfig) : getApp();
      db = getFirestore(app);
      auth = getAuth(app);
      isFirebaseActive = true;
      console.log('🔥 Firebase Cloud Firestore connected successfully (Project: stumas-17f5f)!');
      return { app, db, auth, isFirebaseActive: true };
    } catch (err) {
      console.warn('⚠️ Firebase init warning:', err.message);
      isFirebaseActive = false;
    }
  } else {
    isFirebaseActive = false;
  }
  return { app: null, db: null, auth: null, isFirebaseActive: false };
};

// Initial auto-init with user credentials
initFirebase();

// Firestore Helpers with safe cloud sync
export const recordAttendanceInFirestore = async (record) => {
  if (!db || !isFirebaseActive) return null;
  try {
    const docRef = await addDoc(collection(db, "attendance_logs"), {
      ...record,
      createdAt: serverTimestamp()
    });
    console.log("☁️ Synced to Firestore attendance_logs:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.warn("Firestore sync skipped (check Firestore Rules in Firebase console):", err.message);
    return null;
  }
};

export const syncStudentStatusInFirestore = async (studentId, status, time) => {
  if (!db || !isFirebaseActive) return null;
  try {
    const studentRef = doc(db, "students", studentId);
    await setDoc(studentRef, {
      status,
      time,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log("☁️ Student status synced in Firestore:", studentId, status);
  } catch (err) {
    console.warn("Firestore student sync skipped:", err.message);
  }
};

export { app, db, auth, isFirebaseActive };
