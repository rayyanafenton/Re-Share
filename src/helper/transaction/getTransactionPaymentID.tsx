import { getFirestore, collection, getDoc, doc } from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const getTransactionPaymentID = async (transactionID: any) => {
  const db = getFirestore(FIREBASE_APP);

  const transactionsCollection = collection(db, "transactions");

  try {
    const transactionDoc = await getDoc(
      doc(transactionsCollection, transactionID)
    );

    if (transactionDoc.exists()) {
      const transactionData = transactionDoc.data() as any;

      if (transactionData.paymentID) {
        return transactionData.paymentID;
      } else {
        console.log("No payment ID found for transaction ID:", transactionID);
        return null;
      }
    } else {
      console.log("No transaction found for ID:", transactionID);
      return null;
    }
  } catch (error) {
    console.error("Error getting payment ID:", error);
    return null;
  }
};

export default getTransactionPaymentID;
