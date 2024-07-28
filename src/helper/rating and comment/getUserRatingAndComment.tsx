import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import getUserByID from "../user/getUserByID";

const getUserRatingAndComment = async (userID: any) => {
  const db = getFirestore(FIREBASE_APP);
  const ratingsCollectionRef = collection(db, "ratings");

  try {
    const rateeQuery = query(
      ratingsCollectionRef,
      where("rateeID", "==", userID)
    );
    const rateeSnapshot = await getDocs(rateeQuery);
    const rateeRatings = rateeSnapshot.docs.map(async (doc) => {
      const data = doc.data() as DocumentData;
      const raterID = data.raterID;

      const raterInfo = await getUserByID(raterID);

      return { id: doc.id, ratingData: { ...data, raterInfo } };
    });

    let resolvedRatings = await Promise.all(rateeRatings);

    return resolvedRatings;
  } catch (error) {
    console.error("Error getting user ratings and comments:", error);
    throw error;
  }
};

export default getUserRatingAndComment;
