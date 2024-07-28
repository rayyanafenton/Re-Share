import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const createOffer = async (
  listingID: any,
  acquirerID: any,
  offerTime: any,
  offerPrice: any
) => {
  const db = getFirestore(FIREBASE_APP);
  const offersCollection = collection(db, "offers");
  const listingsCollection = collection(db, "listings");

  try {
    // Get the listing document to retrieve listerID
    const listingDocRef = doc(listingsCollection, listingID);
    const listingSnapshot = await getDoc(listingDocRef);

    if (listingSnapshot.exists()) {
      const listerID = listingSnapshot.data().itemLister;

      const newOffer = {
        listingID: listingID,
        acquirerID: acquirerID,
        listerID: listerID,
        offerTime: offerTime,
        offerPrice: offerPrice,
        status: "Pending",
        activity: "offer",
      };

      await addDoc(offersCollection, newOffer);

      console.log("New offer document created");
    } else {
      console.log("Listing document does not exist for ID:", listingID);
    }
  } catch (error) {
    console.error("Error creating a new offer:", error);
  }
};

export default createOffer;
