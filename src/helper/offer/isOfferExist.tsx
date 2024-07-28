import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const isOfferExist = async (listingID: any, acquirerID: any) => {
  const db = getFirestore(FIREBASE_APP);
  const offersCollection = collection(db, "offers");

  const q = query(
    offersCollection,
    where("listingID", "==", listingID),
    where("acquirerID", "==", acquirerID)
  );

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const offerDoc = querySnapshot.docs[0];

      const offerData = offerDoc.data();
      return offerData.offerPrice;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking for offer existence:", error);
    throw error;
  }
};

export default isOfferExist;
