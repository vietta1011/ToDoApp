// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAkYP6DIG7CAGBu4VrKcON20tFX_mowEA",
  authDomain: "todo-app-81594.firebaseapp.com",
  projectId: "todo-app-81594",
  storageBucket: "todo-app-81594.appspot.com",
  messagingSenderId: "141487528216",
  appId: "1:141487528216:web:fb2420d8979e8096db666d",
  measurementId: "G-X82BN72RMK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
