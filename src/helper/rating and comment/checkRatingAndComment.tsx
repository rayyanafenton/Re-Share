import {
  getFirestore,
  collection,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const checkRatingAndComment = async (ratingIDs: any, raterID: any) => {
  const db = getFirestore(FIREBASE_APP);
  const ratingsCollectionRef = collection(db, "ratings");

  try {
    if (Array.isArray(ratingIDs)) {
      for (const singleRatingID of ratingIDs) {
        const existingRatingDocRef = doc(ratingsCollectionRef, singleRatingID);
        const existingRatingDoc = await getDoc(existingRatingDocRef);

        if (existingRatingDoc.exists()) {
          const ratingData = existingRatingDoc.data() as DocumentData;

          if (ratingData.raterID === raterID) {
            console.log("Rating Object:", {
              id: existingRatingDoc.id,
              ratingData,
            });
            return { id: existingRatingDoc.id, ratingData };
          }
        }
      }
    } else if (ratingIDs instanceof Object) {
      const ratingData = ratingIDs as DocumentData;

      if (ratingData.raterID === raterID) {
        console.log("Rating Object:", {
          id: ratingIDs.id,
          ratingData: ratingIDs,
        });
        return { id: ratingIDs.id, ratingData: ratingIDs };
      }
    }

    console.log("RaterID does not match");
    return null;
  } catch (error) {
    console.error("Error checking rating and comment:", error);
    throw error;
  }
};

export default checkRatingAndComment;
