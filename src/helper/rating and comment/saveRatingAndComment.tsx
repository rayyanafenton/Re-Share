import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc, // Add this import
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const saveRatingAndComment = async (
  transactionID: any,
  rateeID: any,
  raterID: any,
  rating: any,
  comment: any,
  timeStamp: any
) => {
  const db = getFirestore(FIREBASE_APP);
  const ratingsCollectionRef = collection(db, "ratings");

  try {
    // Check if rating for transaction and rater exists
    const existingRatingQuery = query(
      ratingsCollectionRef,
      where("transactionID", "==", transactionID)
    );

    const existingRatingSnapshot = await getDocs(existingRatingQuery);

    if (!existingRatingSnapshot.empty) {
      console.log("Transaction exists in ratings");
      const existingRatingQuery = query(
        ratingsCollectionRef,
        where("raterID", "==", raterID)
      );

      const existingRatingSnapshot = await getDocs(existingRatingQuery);

      if (!existingRatingSnapshot.empty) {
        const existingRatingDoc = existingRatingSnapshot.docs[0];
        await updateDoc(doc(ratingsCollectionRef, existingRatingDoc.id), {
          rating: rating,
          comment: comment,
          timeStamp: timeStamp,
        });

        console.log("Rating and comment updated successfully");

        const ratingsID = existingRatingDoc.id;

        const transactionCollectionRef = collection(db, "transactions");
        const transactionDoc = doc(transactionCollectionRef, transactionID);

        const transactionData = (await getDoc(transactionDoc)).data();
        const currentRatings = transactionData?.ratings || [];

        if (!currentRatings.includes(ratingsID)) {
          currentRatings.push(ratingsID);

          await updateDoc(transactionDoc, { ratings: currentRatings });

          console.log("Ratings ID added to the transactions collection");
        }

        return;
      }
    }

    // Add new rating
    const newRatingDocRef = await addDoc(ratingsCollectionRef, {
      transactionID: transactionID,
      rateeID: rateeID,
      raterID: raterID,
      rating: rating,
      comment: comment,
      timeStamp: timeStamp,
    });

    console.log("Rating and comment stored successfully");

    const newRatingID = newRatingDocRef.id;

    // Update transaction with new ratings ID
    const transactionCollectionRef = collection(db, "transactions");
    const transactionDoc = doc(transactionCollectionRef, transactionID);

    // Get the current ratings array from the transaction
    const transactionData = (await getDoc(transactionDoc)).data();
    const currentRatings = transactionData?.ratings || [];

    // Check if the rating is not already in the array
    if (!currentRatings.includes(newRatingID)) {
      // Add the new ratings ID to the array
      currentRatings.push(newRatingID);

      // Update the transaction with the updated ratings array
      await updateDoc(transactionDoc, { ratings: currentRatings });

      console.log("New Ratings ID added to the transactions collection");
    }

    return "Success";
  } catch (error) {
    console.error("Error storing rating and comment:", error);
    throw error;
  }
};

export default saveRatingAndComment;
