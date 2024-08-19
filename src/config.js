// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfSkXMg1xD865V-EzDSGl7qkmbT5q-Yz4",
  authDomain: "jcproject-d7e0a.firebaseapp.com",
  projectId: "jcproject-d7e0a",
  storageBucket: "jcproject-d7e0a.appspot.com",
  messagingSenderId: "951620959639",
  appId: "1:951620959639:web:742a9e206c0854b69f18d2",
  measurementId: "G-SEL9JKH0RZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);