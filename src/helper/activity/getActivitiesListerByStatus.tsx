import { getFirestore, collection, getDocs } from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import getListingByID from "../listing/getListingByID";
import getUserByID from "../user/getUserByID";

const getActivityListerByStatus = async (listerID: any, status: any) => {
  const db = getFirestore(FIREBASE_APP);

  const transactionsCollection = collection(db, "transactions");
  const offersCollection = collection(db, "offers");

  try {
    const [transactionSnapshot, offerSnapshot] = await Promise.all([
      getDocs(transactionsCollection),
      getDocs(offersCollection),
    ]);

    const activity: any[] = [];

    if (!transactionSnapshot.empty) {
      const transactionPromises = transactionSnapshot.docs.map(async (doc) => {
        const transactionData = doc.data() as any;
        const listingData = (await getListingByID(
          transactionData.listingID
        )) as any;

        if (listingData?.itemLister === listerID) {
          const itemAcquirer = await getUserByID(transactionData.acquirerID);
          const transactionID = doc.id;
          activity.push({
            ...transactionData,
            listingData,
            itemAcquirer,
            transactionID,
          });
        }
      });

      await Promise.all(transactionPromises);
    }

    if (!offerSnapshot.empty) {
      const offerPromises = offerSnapshot.docs.map(async (doc) => {
        const offerData = doc.data() as any;
        const listingData = (await getListingByID(offerData.listingID)) as any;
        const offerID = doc.id;
        if (listingData?.itemLister.id === listerID) {
          activity.push({ ...offerData, listingData, offerID });
        }
      });

      await Promise.all(offerPromises);
    }

    const filteredActivity = activity.filter((item) => item.status === status);
    return filteredActivity;
  } catch (error) {
    console.error("Error getting transactions and offers:", error);
    throw error;
  }
};

export default getActivityListerByStatus;
