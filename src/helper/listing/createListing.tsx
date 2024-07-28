import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";
import uploadImageToStorage from "../../utils/uploadImageToStorage";

const createListing = async (state: any) => {
  try {
    const db = FIREBASE_DB;
    const listingsCollection = collection(db, "listings");

    const downloadURLs = [];

    for (const imageUri of state.imageUris) {
      const downloadURL = await uploadImageToStorage(imageUri);
      downloadURLs.push(downloadURL);
    }

    const updatedState = { ...state, imageUris: downloadURLs };

    const docRef = await addDoc(listingsCollection, updatedState);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export default createListing;
