import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const deleteOffer = async (listingID: string, acquirerID: string) => {
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
    await deleteDoc(offerDoc);

    console.log("Offer deleted successfully.");
  } catch (error) {
    console.error("Error deleting the offer:", error);
    throw error;
  }
};

export default deleteOffer;
