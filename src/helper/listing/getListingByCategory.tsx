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

const getListingByCategory = async (userID: string, itemCategory: string) => {
  try {
    const db = getFirestore(FIREBASE_APP);

    // Query to get listings without the user
    const q = query(
      collection(db, "listings"),
      where("itemLister", "!=", userID)
    );

    const listingsCollection = await getDocs(q);

    const listingData: any[] = [];

    // Using Promise.all to wait for all promises to resolve
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

    // Filter the listings by item category
    const filteredListings = listingData.filter(
      (listing) => listing.itemCategory === itemCategory
    );

    return filteredListings;
  } catch (error) {
    console.error("Error getting listings:", error);
    return null;
  }
};

export default getListingByCategory;
