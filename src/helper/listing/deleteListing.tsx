import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const deleteListing = async (listingId: string) => {
  try {
    const db = FIREBASE_DB;

    const listingsCollection = collection(db, "listings");
    const listingDoc = doc(listingsCollection, listingId);
    const listingData = (await getDoc(listingDoc)).data();

    const transactionsCollection = collection(db, "transactions");
    const transactionsQuery = query(
      transactionsCollection,
      where("listingID", "==", listingId)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    const transactionData = transactionsSnapshot.docs.map((doc) => doc.data());

    const offersCollection = collection(db, "offers");
    const offersQuery = query(
      offersCollection,
      where("listingID", "==", listingId)
    );
    const offerSnapshot = await getDocs(offersQuery);
    const offerData = offerSnapshot.docs.map((doc) => doc.data());

    // Delete transactions
    transactionsSnapshot.forEach(async (transactionDoc) => {
      await deleteDoc(transactionDoc.ref);
      console.log(
        `Transaction with ID ${transactionDoc.id} deleted successfully.`
      );
    });

    // Delete offers
    offerSnapshot.forEach(async (offerDoc) => {
      await deleteDoc(offerDoc.ref);
      console.log(`Offer with ID ${offerDoc.id} deleted successfully.`);
    });

    // Delete the listing
    await deleteDoc(listingDoc);

    console.log(`Listing with ID ${listingId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting listing:", error);
  }
};

export default deleteListing;
