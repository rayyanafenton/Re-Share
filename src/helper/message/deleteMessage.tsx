import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const deleteMessage = async (messageID: string) => {
  const db = FIREBASE_DB;
  const messageDocRef = doc(db, "messages", messageID);

  try {
    await deleteDoc(messageDocRef);
    console.log(`Message with ID ${messageID} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting message with ID ${messageID}:`, error);
    throw error;
  }
};

export default deleteMessage;
