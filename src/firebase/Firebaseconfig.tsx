import { initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSc0weKbxEQXvCZQnk70xcAV96QOg7B34",
  authDomain: "reshare-564f1.firebaseapp.com",
  projectId: "reshare-564f1",
  storageBucket: "reshare-564f1.appspot.com",
  messagingSenderId: "326115208946",
  appId: "1:326115208946:web:5fdc3d133ad97cc4392a6b",
  measurementId: "G-N2M7K3JGEB",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

setPersistence(FIREBASE_AUTH, inMemoryPersistence)
  .then(() => {
    console.log("successfully sotre auth in persistence");
  })
  .catch((error) => {
    console.error("Error setting up persistence:", error);
  });

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
