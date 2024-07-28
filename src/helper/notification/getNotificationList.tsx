import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const getNotificationList = async (receiverID: any) => {
  const db = FIREBASE_DB;
  const notificationsCollection = collection(db, "notifications");

  try {
    const q = query(
      notificationsCollection,
      where("receiverID", "==", receiverID)
    );
    const querySnapshot = await getDocs(q);

    const notifications: any[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id, // Include the document ID
        ...doc.data(),
      });
    });

    return notifications;
  } catch (error) {
    console.error("Error getting notification list:", error);
    return [];
  }
};

export default getNotificationList;
