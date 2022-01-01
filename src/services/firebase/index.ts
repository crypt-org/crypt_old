// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuGTCi8uIY0HyQLD3KB_3OIlkWExJVX3E",
  authDomain: "security-crypt-app.firebaseapp.com",
  projectId: "security-crypt-app",
  storageBucket: "security-crypt-app.appspot.com",
  messagingSenderId: "549788798737",
  appId: "1:549788798737:web:789a01f9cf89c9cde8c6b0",
  measurementId: "G-VK9015CFW5"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const Analytics = getAnalytics(FirebaseApp);
Analytics.app.automaticDataCollectionEnabled = false;


export const FirestoreDB = getFirestore();
export default FirebaseApp;