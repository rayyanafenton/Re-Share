import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const createLike = async (listingId: any, userId: any) => {
  const db = FIREBASE_DB;
  const likesCollection = collection(db, "likes");

  try {
    await addDoc(likesCollection, {
      userId: userId,
      listingId: listingId,
    });
  } catch (error) {
    console.error("Error adding like:", error);
  }
};

export default createLike;
