import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const deleteLike = async (listingId: any, userId: any) => {
  const db = FIREBASE_DB;
  const likesCollection = collection(db, "likes");

  try {
    const q = query(
      likesCollection,
      where("userId", "==", userId),
      where("listingId", "==", listingId)
    );

    const likeQuery = await getDocs(q);

    likeQuery.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error removing like:", error);
  }
};

export default deleteLike;
