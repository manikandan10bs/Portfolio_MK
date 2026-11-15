import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzYe7a0AzqSuJ1xD35xBGGGBQSROor55A",
  authDomain: "manikandan10bs.firebaseapp.com",
  projectId: "manikandan10bs",
  storageBucket: "manikandan10bs.firebasestorage.app",
  messagingSenderId: "502608432837",
  appId: "1:502608432837:web:3baf7815837ed284176aac",
  measurementId: "G-GTMYYHR7Q8"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const ADMIN_EMAIL = "manikandan10bs@gmail.com";

let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export { app, analytics };
export default app;
