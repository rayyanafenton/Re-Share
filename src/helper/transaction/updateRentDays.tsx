import {
  getFirestore,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const updateRentDays = async (listingID: any, newTotalRentDays: any) => {
  const db = getFirestore(FIREBASE_APP);

  try {
    const transactionsCollection = collection(db, "transactions");
    const transactionQuery = query(
      transactionsCollection,
      where("listingID", "==", listingID)
    );
    const transactionSnapshot = await getDocs(transactionQuery);

    const transactionRef = doc(
      db,
      "transactions",
      transactionSnapshot.docs[0].id
    );

    await updateDoc(transactionRef, {
      totalRentDays: newTotalRentDays,
    });

    console.log("Total rent days updated successfully");
  } catch (error) {
    console.error("Error updating total rent days:", error);
    throw error;
  }
};

export default updateRentDays;
