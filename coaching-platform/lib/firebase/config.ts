// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv2x4weXidQxeTaYlEwVWTvuTu6skAIIs",
  authDomain: "beingconsultant-e5c75.firebaseapp.com",
  projectId: "beingconsultant-e5c75",
  storageBucket: "beingconsultant-e5c75.firebasestorage.app",
  messagingSenderId: "441666605153",
  appId: "1:441666605153:web:ebd99eb78326cf80f8da20",
  measurementId: "G-ZFXWQ057C6"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
