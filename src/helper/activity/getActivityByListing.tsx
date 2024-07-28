import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import getListingByID from "../listing/getListingByID";
import getUserByID from "../user/getUserByID";

const getActivityByListingID = async (listingID: string) => {
  const db = getFirestore(FIREBASE_APP);
  const transactionsCollection = collection(db, "transactions");

  const transactionQuery = query(
    transactionsCollection,
    where("listingID", "==", listingID)
  );

  try {
    const transactionSnapshot = await getDocs(transactionQuery);

    const activity: any[] = [];

    if (!transactionSnapshot.empty) {
      for (const doc of transactionSnapshot.docs) {
        const transactionData = doc.data();
        const listingData = await getListingByID(transactionData.listingID);
        const itemLister = await getUserByID(transactionData.listerID);
        const transactionID = doc.id;
        activity.push({
          ...transactionData,
          itemLister,
          listingData,
          transactionID,
        });
      }
    }

    return activity;
  } catch (error) {
    console.error("Error getting activity by listing ID:", error);
    throw error;
  }
};

export default getActivityByListingID;
