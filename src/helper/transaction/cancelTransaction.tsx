import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";
import updateTransactionStatus from "./updateTransactionStatus";

const cancelTransaction = async (listingID: any, transactionID: any) => {
  try {
    await updateTransactionStatus(transactionID, "Unsuccessful");

    const db = FIREBASE_DB;
    const listingsCollection = collection(db, "listings");

    const listingDocRef = doc(listingsCollection, listingID);
    await updateDoc(listingDocRef, { status: "Available" });
    console.log(`Status property removed from listing with ID ${listingID}.`);
  } catch (error) {
    console.error("Error canceling transaction:", error);
  }
};

export default cancelTransaction;
