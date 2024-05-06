import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCA8ScgfvZxu8GTzUzm2KjGRtt93YTk1Qc",
  authDomain: "sip-portal-testing.firebaseapp.com",
  projectId: "sip-portal-testing",
  storageBucket: "sip-portal-testing.appspot.com",
  messagingSenderId: "721177049240",
  appId: "1:721177049240:web:90c647c3d48fc151fb38ed",
  measurementId: "G-1DPBQ7RPJB"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app)
export const db = getFirestore(app);
export default app 