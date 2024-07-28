import { collection, getDocs, where, query } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const isMessageExist = async (
  listerID: any,
  acquirerID: any,
  listingID: any
) => {
  const db = FIREBASE_DB;
  const messagesCollection = collection(db, "messages");

  // Create a Firestore query with conditions
  const q = query(
    messagesCollection,
    where("listerID", "==", listerID),
    where("acquirerID", "==", acquirerID),
    where("listingID", "==", listingID)
  );

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      const firstDocument = querySnapshot.docs[0];
      return firstDocument.id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking if message exists:", error);
    return null;
  }
};

export default isMessageExist;
