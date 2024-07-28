import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const getMessageById = async (messageID: any) => {
  const db = FIREBASE_DB;

  try {
    const messageDoc = await getDoc(doc(db, "messages", messageID));

    if (messageDoc.exists()) {
      return { id: messageID, ...messageDoc.data() };
    } else {
      console.error("Message document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting message: ", error);
    return null;
  }
};

export default getMessageById;
