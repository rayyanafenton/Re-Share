import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const createTransaction = async (
  listingID: any,
  acquirerID: any,
  status: any,
  price: any,
  createdDate: any,
  isBid: any
) => {
  const db = FIREBASE_DB;
  const transactionsCollection = collection(db, "transactions");
  const listingsCollection = collection(db, "listings");

  try {
    // Get the listing document to retrieve listerID
    const listingDocRef = doc(listingsCollection, listingID);
    const listingSnapshot = await getDoc(listingDocRef);

    if (listingSnapshot.exists()) {
      const listerID = listingSnapshot.data().itemLister;

      const newTransaction = {
        listingID: listingID,
        acquirerID: acquirerID,
        listerID: listerID,
        status: status,
        price: price,
        createdDate: createdDate,
        totalRentDays: 0,
        activity: "transaction",
      };

      const transactionQuery = query(
        transactionsCollection,
        where("listingID", "==", listingID)
      );
      const existingTransactionSnapshot = await getDocs(transactionQuery);

      existingTransactionSnapshot.forEach(async (transactionDoc) => {
        await deleteDoc(transactionDoc.ref);
        console.log(
          `Transaction with ID ${transactionDoc.id} deleted successfully.`
        );
      });

      const newDocRef = await addDoc(transactionsCollection, newTransaction);
      console.log("New transaction document created with ID:", newDocRef.id);

      await updateDoc(listingDocRef, { status: "Taken" });
      console.log(
        "Listing status updated to 'not available' for ID:",
        listingID
      );
    } else {
      console.log("Listing document does not exist for ID:", listingID);
    }
  } catch (error) {
    console.error("Error creating or updating transaction:", error);
  }
};

export default createTransaction;
