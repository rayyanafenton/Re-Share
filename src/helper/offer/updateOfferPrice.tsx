import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const updateOfferPrice = async (
  listingID: string,
  acquirerID: string,
  newOfferPrice: any
) => {
  const db = getFirestore(FIREBASE_APP);
  const offersCollection = collection(db, "offers");

  const q = query(
    offersCollection,
    where("listingID", "==", listingID),
    where("acquirerID", "==", acquirerID)
  );

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching offer found.");
      return;
    }

    const offerDoc = doc(db, "offers", querySnapshot.docs[0].id);
    await updateDoc(offerDoc, { offerPrice: newOfferPrice });

    console.log("Offer price modified successfully.");
  } catch (error) {
    console.error("Error modifying the offer price:", error);
    throw error;
  }
};

export default updateOfferPrice;
