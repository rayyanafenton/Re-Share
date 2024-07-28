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

const getLikedListings = async (userId: string) => {
  try {
    const db = getFirestore(FIREBASE_APP);

    // Query to get listingIds where userId matches
    const likeQuery = query(
      collection(db, "likes"),
      where("userId", "==", userId)
    );

    const likeDocs = await getDocs(likeQuery);

    const listingIds: string[] = [];

    likeDocs.forEach((likeDoc) => {
      const data = likeDoc.data();
      const listingId = data.listingId;
      if (listingId) {
        listingIds.push(listingId);
      }
    });

    console.log("Listing IDs:", listingIds);

    // Check if listingIds is not empty before creating the second query
    if (listingIds.length > 0) {
      const listingsQuery = query(
        collection(db, "listings"),
        where("__name__", "in", listingIds)
      );

      const listingsCollection = await getDocs(listingsQuery);

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

      console.log("Listing Data:", listingData);

      return listingData;
    } else {
      console.log("No listingIds found");
      return [];
    }
  } catch (error) {
    console.error("Error getting liked listings:", error);
    return null;
  }
};

export default getLikedListings;
