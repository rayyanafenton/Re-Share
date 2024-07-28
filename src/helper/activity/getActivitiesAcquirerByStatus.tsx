import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import getListingByID from "../listing/getListingByID";
import { ActivityIndicator } from "react-native";
import getUserByID from "../user/getUserByID";

const getActivitiesAcquirerByStatus = async (
  acquirerID: string,
  status: any
) => {
  const db = getFirestore(FIREBASE_APP);
  const transactionsCollection = collection(db, "transactions");
  const offersCollection = collection(db, "offers");

  const transactionQuery = query(
    transactionsCollection,
    where("acquirerID", "==", acquirerID)
  );
  const offerQuery = query(
    offersCollection,
    where("acquirerID", "==", acquirerID)
  );

  try {
    const transactionSnapshot = await getDocs(transactionQuery);
    const offerSnapshot = await getDocs(offerQuery);

    const activity: any[] = [];

    if (!transactionSnapshot.empty) {
      for (const doc of transactionSnapshot.docs) {
        const transactionData = doc.data();
        const listingID = transactionData.listingID;
        const listingData = await getListingByID(listingID);
        const itemLister = await getUserByID(transactionData.listerID);
        const transactionID = doc.id;
        activity.push({
          ...transactionData,
          listingData,
          itemLister,
          transactionID,
        });
      }
    }

    if (!offerSnapshot.empty) {
      for (const doc of offerSnapshot.docs) {
        const offerData = doc.data();
        const listingID = offerData.listingID;
        const listingData = await getListingByID(listingID);
        const itemLister = await getUserByID(offerData.listerID);
        const offerID = doc.id;
        activity.push({ ...offerData, listingData, itemLister, offerID });
      }
    }
    const filteredActivity = activity.filter((item) => item.status === status);
    return filteredActivity;
  } catch (error) {
    console.error("Error getting transactions and offers:", error);
    throw error;
  }
};

export default getActivitiesAcquirerByStatus;
