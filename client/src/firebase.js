// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-state-cbf12.firebaseapp.com",
  projectId: "e-state-cbf12",
  storageBucket: "e-state-cbf12.appspot.com",
  messagingSenderId: "56083725266",
  appId: "1:56083725266:web:d0fb6bd4a98c0fbd18260b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
