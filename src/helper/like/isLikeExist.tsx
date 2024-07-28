import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const isLikeExist = async (listingId: any, userId: any) => {
  const db = FIREBASE_DB;
  const likeCollection = collection(db, "likes");

  try {
    const q = query(
      likeCollection,
      where("userId", "==", userId),
      where("listingId", "==", listingId)
    );

    const likeQuery = await getDocs(q);
    return !likeQuery.empty;
  } catch (error) {
    console.error("Error checking like:", error);
    return false;
  }
};

export default isLikeExist;
