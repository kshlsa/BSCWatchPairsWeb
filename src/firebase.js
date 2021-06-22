import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJFmW5YCuaeLRIpdRE1uXP16e-xSouR2c",
  authDomain: "twitter-clone-d74a6.firebaseapp.com",
  projectId: "twitter-clone-d74a6",
  storageBucket: "twitter-clone-d74a6.appspot.com",
  messagingSenderId: "306691374615",
  appId: "1:306691374615:web:ca58ef80e06116cde12652",
  measurementId: "G-R8JBC2FWMG"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export default db;
