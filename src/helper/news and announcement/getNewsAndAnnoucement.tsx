import { getFirestore, collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

// Function to retrieve the news and announcements from Firestore
const getNewsAndAnnouncement = async () => {
  try {
    const db = FIREBASE_DB;
    const newsAndAnnouncementCollection = collection(
      db,
      "newsAndAnnouncements"
    );
    const querySnapshot = await getDocs(newsAndAnnouncementCollection);

    const newsAndAnnouncementData: any = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newsAndAnnouncementData.push({
        id: doc.id,
        ...data,
      });
    });

    return newsAndAnnouncementData;
  } catch (error) {
    console.error("Error retrieving news and announcements:", error);
    throw error;
  }
};

export default getNewsAndAnnouncement;
