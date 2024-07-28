import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";
import { getFormatedDate } from "react-native-modern-datepicker";

const createLike = async (
  senderID: any,
  receiverID: any,
  title: any,
  message: any,
  imageURL: any,
  time: any
) => {
  const db = FIREBASE_DB;
  const likesCollection = collection(db, "notifications");

  try {
    const formattedTime = getFormatedDate(time);
    await addDoc(likesCollection, {
      senderID: senderID,
      receiverID: receiverID,
      title: title,
      message: message,
      imageURL: imageURL
        ? imageURL
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Grey_background.jpg/339px-Grey_background.jpg",
      time: formattedTime,
    });
    console.log("Successfully create notification");
  } catch (error) {
    console.error("Error adding like:", error);
  }
};

export default createLike;
