import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_DB } from "../../firebase/Firebaseconfig";
import uploadImageToStorage from "../../utils/uploadImageToStorage";

const updateListing = async (listingId: string, state: any) => {
  const db = FIREBASE_DB;
  const listingsCollection = collection(db, "listings");
  const listingDoc = doc(listingsCollection, listingId);
  let updatedState;

  try {
    if (state.imageUris.length > 0) {
      const downloadURLs = [];

      for (const imageUri of state.imageUris) {
        const downloadURL = await uploadImageToStorage(imageUri);
        downloadURLs.push(downloadURL);
      }

      updatedState = { ...state, imageUris: downloadURLs };
    }
    await updateDoc(listingDoc, updatedState);
    console.log("Listing updated successfully!");
  } catch (error) {
    console.error("Error updating listing:", error);
  }
};

export default updateListing;
