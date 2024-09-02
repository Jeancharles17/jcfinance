import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyCd_hK70Gn5oJ0vY0aMhDcmjx-7nqqD7RY",
  authDomain: "jcpojec3.firebaseapp.com",
  databaseURL: "https://jcpojec3-default-rtdb.firebaseio.com",
  projectId: "jcpojec3",
  storageBucket: "jcpojec3.appspot.com",
  messagingSenderId: "437107443051",
  appId: "1:437107443051:web:8d24e55f1012fc51fd782e",
  measurementId: "G-C91F9ES0GX"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage};