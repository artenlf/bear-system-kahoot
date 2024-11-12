import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBslaS3x7x16vOSQ388jQsC6XSoqLNIiR8",
  authDomain: "bear-system-kahoot.firebaseapp.com",
  projectId: "bear-system-kahoot",
  storageBucket: "bear-system-kahoot.firebasestorage.app",
  messagingSenderId: "518699083398",
  appId: "1:518699083398:web:63426bfc23fc47a74a1307"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
