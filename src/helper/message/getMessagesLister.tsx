import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const getMessagesLister = async (listerID: string) => {
  const db = FIREBASE_DB;

  try {
    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, where("listerID", "==", listerID));
    const querySnapshot = await getDocs(q);

    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
  } catch (error) {
    console.error("Error getting messages: ", error);
    return [];
  }
};

export default getMessagesLister;
