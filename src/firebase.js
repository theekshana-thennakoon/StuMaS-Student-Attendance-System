// Firebase configuration & sync layer
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc,
  getDocs, 
  getDoc,
  updateDoc, 
  doc, 
  query, 
  where,
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

export const registerUserInFirebase = async ({ email, password, name, studentId, grade, role = 'student' }) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedId = (studentId || '').trim();
  const trimmedName = (name || '').trim();
  const userRole = role || 'student';

  // 1. Try Firebase Auth (if Auth is configured in project)
  let authUid = null;
  if (auth && isFirebaseActive && normalizedEmail && password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      authUid = userCredential.user?.uid;
      console.log("🔥 Firebase Auth user registered:", authUid);
    } catch (authErr) {
      console.warn("Firebase Auth note:", authErr.code || authErr.message);
    }
  }

  const userDocId = trimmedId || normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_');
  const userData = {
    uid: authUid || `user_${Date.now()}`,
    email: normalizedEmail,
    password: password,
    name: trimmedName,
    studentId: trimmedId,
    grade: grade || 'Grade 8',
    className: `Class ${grade ? grade.replace('Grade ', '') : '8'}A`,
    role: userRole,
    createdAt: new Date().toISOString()
  };

  // 2. Save directly to Firestore 'users' collection
  let firestoreSaved = false;
  if (db && isFirebaseActive) {
    try {
      await setDoc(doc(db, "users", userDocId), userData, { merge: true });
      console.log("☁️ User successfully saved in Firestore 'users':", userDocId);

      // If student, also ensure they are in 'students' collection for roster
      if (userRole === 'student') {
        await setDoc(doc(db, "students", trimmedId || userDocId), {
          id: trimmedId || userDocId,
          studentId: trimmedId,
          name: trimmedName,
          email: normalizedEmail,
          grade: grade || 'Grade 8',
          className: `Class ${grade ? grade.replace('Grade ', '') : '8'}A`,
          status: 'Not Marked',
          time: '-',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log("☁️ Student roster doc created in Firestore 'students':", trimmedId);
      }
      firestoreSaved = true;
    } catch (fsErr) {
      console.warn("Firestore save warning (check Security Rules in Firebase console):", fsErr.message);
    }
  }

  // 3. Keep local cache for reliable fallback
  try {
    const localUsers = JSON.parse(localStorage.getItem('stumas_registered_users') || '[]');
    const existingIndex = localUsers.findIndex(u => 
      (normalizedEmail && u.email?.toLowerCase() === normalizedEmail) || 
      (trimmedId && u.studentId === trimmedId)
    );
    if (existingIndex >= 0) {
      localUsers[existingIndex] = userData;
    } else {
      localUsers.push(userData);
    }
    localStorage.setItem('stumas_registered_users', JSON.stringify(localUsers));
  } catch (err) {
    console.warn("Local storage cache warning:", err);
  }

  return { success: true, user: userData, firestoreSaved };
};

export const loginUserFromFirebase = async (identifier, password, targetRole = 'student') => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // Allow standard admin fallback credentials
  if (targetRole === 'teacher') {
    if (cleanId === 'admin' || cleanId === 'admin@school.edu') {
      return {
        success: true,
        user: {
          name: "Administrator",
          email: "admin@school.edu",
          role: "teacher"
        }
      };
    }
  }

  let matchedUser = null;

  // 1. Check Firebase Firestore 'users' collection
  if (db && isFirebaseActive) {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      usersSnap.forEach(docSnap => {
        const data = docSnap.data();
        const userEmail = (data.email || '').toLowerCase().trim();
        const userStudentId = (data.studentId || '').toLowerCase().trim();
        if (userEmail === cleanId || userStudentId === cleanId) {
          matchedUser = data;
        }
      });
      if (matchedUser) {
        console.log("☁️ User verified in Firestore 'users':", matchedUser.email || matchedUser.studentId);
      }
    } catch (fsErr) {
      console.warn("Firestore user query notice:", fsErr.message);
    }
  }

  // 2. Check local registered users if not fetched from Firestore
  if (!matchedUser) {
    try {
      const localUsers = JSON.parse(localStorage.getItem('stumas_registered_users') || '[]');
      matchedUser = localUsers.find(u => 
        (u.email && u.email.toLowerCase().trim() === cleanId) ||
        (u.studentId && u.studentId.toLowerCase().trim() === cleanId)
      );
      if (matchedUser) {
        console.log("📦 User verified in local registration cache:", matchedUser.email || matchedUser.studentId);
      }
    } catch (err) {
      console.warn("Local storage lookup warning:", err);
    }
  }

  // 3. Try Firebase Auth signIn if it's an email
  if (auth && isFirebaseActive && cleanId.includes('@')) {
    try {
      await signInWithEmailAndPassword(auth, cleanId, cleanPassword);
      console.log("🔥 Firebase Auth credentials confirmed:", cleanId);
    } catch (authErr) {
      console.warn("Firebase Auth signIn note:", authErr.code);
    }
  }

  // If no user found anywhere
  if (!matchedUser) {
    return {
      success: false,
      error: "No registered account found for this Student ID / Email. Please click Register to create your account first."
    };
  }

  // If password exists and doesn't match
  if (matchedUser.password && cleanPassword && matchedUser.password !== cleanPassword) {
    return {
      success: false,
      error: "Incorrect password. Please verify your password and try again."
    };
  }

  // If role mismatch
  if (targetRole && matchedUser.role && matchedUser.role !== targetRole) {
    if (targetRole === 'teacher' && matchedUser.role !== 'teacher' && matchedUser.role !== 'admin') {
      return {
        success: false,
        error: "This account is registered as a Student, not an Administrator."
      };
    }
  }

  return {
    success: true,
    user: matchedUser
  };
};

export { app, db, auth, isFirebaseActive };
