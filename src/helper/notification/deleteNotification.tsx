import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const deleteNotification = async (notificationID: string) => {
  const db = FIREBASE_DB;
  const notificationDocRef = doc(db, "notifications", notificationID);

  try {
    await deleteDoc(notificationDocRef);
    console.log(`Notification with ID ${notificationID} deleted successfully.`);
  } catch (error) {
    console.error(
      `Error deleting notification with ID ${notificationID}:`,
      error
    );
    throw error;
  }
};

export default deleteNotification;
