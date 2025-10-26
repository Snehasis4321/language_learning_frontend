// Firebase configuration - commented out for Appwrite migration
// Uncomment to rollback to Firebase auth

// import { initializeApp, FirebaseOptions, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// const firebaseConfig: FirebaseOptions | undefined = process.env
//   .NEXT_PUBLIC_FIREBASE_SERVICE_JSON
//   ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_JSON)
//   : undefined;

// if (!firebaseConfig) {
//   console.error("Firebase configuration is missing.");
//   throw new Error("Firebase configuration is missing.");
// }

// const app =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// export const auth = getAuth(app);
// export const storage = getStorage(app);
