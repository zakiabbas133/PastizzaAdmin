import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAi7M0WjWgKSqzeTlsLl9WDwNvafkXAw1I",
  authDomain: "pastizza.firebaseapp.com",
  projectId: "pastizza",
  storageBucket: "pastizza.firebasestorage.app",
  messagingSenderId: "954552795216",
  appId: "1:954552795216:web:9e13b916c1b24e0268d155",
  measurementId: "G-QE2VXH03ML"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app, analytics };