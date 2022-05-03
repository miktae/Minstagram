// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAK84KKyw0B8C6L0G8BzN5Ao1XCtcwKNho",
  authDomain: "instagram-d2f00.firebaseapp.com",
  projectId: "instagram-d2f00",
  databaseURL: "https://instagram-d2f00.asia-southeast1.firebasedatabase.app",
  storageBucket: "instagram-d2f00.appspot.com",
  messagingSenderId: "88950760427",
  appId: "1:88950760427:web:2d577b17a8a270affdafae",
  measurementId: "G-RC41ZW7LGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export { auth, db, storage };