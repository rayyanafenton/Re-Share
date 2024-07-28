import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const getMessage = (messageObject: any, setMessages: any, setLoading: any) => {
  const msgQuery = query(
    collection(doc(FIREBASE_DB, "messages", messageObject.id), "user messages"),
    orderBy("timeStamp", "asc")
  );

  const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
    const upMsg = querySnap.docs.map((doc) => doc.data());
    setMessages(upMsg);
  });

  return unsubscribe;
};

export default getMessage;
