import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const sendMessage = async (
  message: any,
  setMessage: any,
  messageObject: any,
  user: any
) => {
  if (message) {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const chat = {
      id: id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };
    setMessage("");
    await addDoc(
      collection(FIREBASE_DB, "messages", messageObject.id, "user messages"),
      chat
    )
      .then(() => {})
      .catch((err) => alert(err));
  }
};

export default sendMessage;
