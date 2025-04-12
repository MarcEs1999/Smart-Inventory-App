import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZNgQxQ2kijGLk0wqL-RYMOzRyqlTGwAA",
  authDomain: "smart-inventory-manager-44a4d.firebaseapp.com",
  projectId: "smart-inventory-manager-44a4d",
  storageBucket: "smart-inventory-manager-44a4d.firebasestorage.app",
  messagingSenderId: "220810973242",
  appId: "1:220810973242:web:cc3e2782cdb775e7c6e503",
  measurementId: "G-S3EV5BNJ88"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);