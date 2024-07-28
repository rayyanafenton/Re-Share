import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import getUserByID from "../user/getUserByID";

const getListingByID = async (listingID: any) => {
  const db = getFirestore(FIREBASE_APP);
  const listingRef = doc(db, "listings", listingID);

  try {
    const doc = await getDoc(listingRef);

    if (doc.exists()) {
      const data = doc.data();
      const itemListerId = data.itemLister;
      const itemLister = itemListerId ? await getUserByID(itemListerId) : null;

      const listingObject = {
        id: doc.id,
        itemLister: itemLister,
        ...data,
      };

      return listingObject;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting listing by ID:", error);
    throw error;
  }
};

export default getListingByID;
