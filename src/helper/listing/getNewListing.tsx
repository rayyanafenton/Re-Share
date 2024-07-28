import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import getUserByID from "../user/getUserByID";

const getNewListing = async (userId: string) => {
  try {
    const db = getFirestore(FIREBASE_APP);

    const listingsQuery = query(
      collection(db, "listings"),
      orderBy("listTime", "desc"),
      limit(10)
    );

    const listingsCollection = await getDocs(listingsQuery);

    const listingData: any[] = [];

    await Promise.all(
      listingsCollection.docs.map(async (doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        const itemLister = await getUserByID(data.itemLister);
        const id = doc.id;
        const listingWithId = { ...data, itemLister, id };

        if (
          data.itemLister !== userId &&
          data.status !== "Not available" &&
          data.status !== "Taken"
        ) {
          listingData.push(listingWithId);
        }
      })
    );

    console.log("New Listings Data:", listingData);

    return listingData;
  } catch (error) {
    console.error("Error getting new listings:", error);
    return null;
  }
};

export default getNewListing;
