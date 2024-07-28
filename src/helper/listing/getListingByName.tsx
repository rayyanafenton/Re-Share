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

const getListingByName = async (userID: string, itemName: string) => {
  try {
    const db = getFirestore(FIREBASE_APP);

    const q = query(
      collection(db, "listings"),
      where("itemLister", "!=", userID)
    );

    const listingsCollection = await getDocs(q);

    const listingData: any[] = [];

    await Promise.all(
      listingsCollection.docs.map(async (doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        const itemLister = await getUserByID(data.itemLister);
        const id = doc.id;
        const listingWithId = { ...data, itemLister, id };

        if (data.status !== "Not available") {
          listingData.push(listingWithId);
        }
      })
    );

    const filteredListings = listingData.filter((listing) =>
      listing.itemName.toLowerCase().includes(itemName.toLowerCase())
    );

    return filteredListings;
  } catch (error) {
    console.error("Error getting listings:", error);
    return null;
  }
};

export default getListingByName;
