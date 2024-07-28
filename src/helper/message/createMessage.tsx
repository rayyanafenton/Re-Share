import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const createMessage = async (
  listerID: any,
  acquirerID: any,
  listingID: any
) => {
  const db = FIREBASE_DB;

  try {
    const docRef = await addDoc(collection(db, "messages"), {
      listerID,
      acquirerID,
      listingID,
    });

    console.log("Message added with ID: ", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error("Error adding message: ", error);
    return null; // or handle the error accordingly
  }
};

export default createMessage;
