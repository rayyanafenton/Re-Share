import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import getUserByID from "../user/getUserByID";

const getFilteredListingByUser = async (itemListerId: string) => {
  try {
    const db = getFirestore(FIREBASE_APP);

    // Create a query to filter listings based on itemListerId
    const q = query(
      collection(db, "listings"),
      where("itemLister", "==", itemListerId)
    );

    // Execute the query
    const listingsCollection = await getDocs(q);

    const listingData: any[] = [];
    await Promise.all(
      listingsCollection.docs.map(async (doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        const itemLister = await getUserByID(data.itemLister);
        const id = doc.id;
        const listingWithId = { ...data, itemLister, id };

        if (data.status !== "Not available" && data.status !== "Taken") {
          listingData.push(listingWithId);
        }
      })
    );

    return listingData;
  } catch (error) {
    console.error("Error getting listings:", error);
    return null;
  }
};

export default getFilteredListingByUser;
