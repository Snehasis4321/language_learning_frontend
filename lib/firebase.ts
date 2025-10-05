// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseOptions, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig: FirebaseOptions | undefined = process.env
  .NEXT_PUBLIC_FIREBASE_SERVICE_JSON
  ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_JSON)
  : undefined;

if (!firebaseConfig) {
  console.error("Firebase configuration is missing.");
  throw new Error("Firebase configuration is missing.");
}

// Initialize Firebase only once
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const storage = getStorage(app);
