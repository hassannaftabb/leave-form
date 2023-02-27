// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZNV_9grCPxH5Idp0cHUJpKixjtPoWvu8",
  authDomain: "leave-form-6908b.firebaseapp.com",
  projectId: "leave-form-6908b",
  storageBucket: "leave-form-6908b.appspot.com",
  messagingSenderId: "298536241168",
  appId: "1:298536241168:web:890d8d3e30470c491b2295",
  measurementId: "G-3S25VNHCGJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export default database;
