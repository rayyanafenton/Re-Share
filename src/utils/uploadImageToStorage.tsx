import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebase/Firebaseconfig";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { FIREBASE_APP } from "../firebase/Firebaseconfig";

const uploadImageToStorage = (imageUri: any) => {
  const storage = getStorage(FIREBASE_APP);
  const storageRef = ref(storage, "images/" + Date.now());

  return fetch(imageUri)
    .then((response) => response.blob())
    .then((blob) => {
      const uploadTask = uploadBytesResumable(storageRef, blob); //uploading

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        () => {
          console.log("Upload complete");
        }
      );

      return uploadTask.then(() => getDownloadURL(storageRef)); //downloading
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
      return null;
    });
};

export default uploadImageToStorage;
