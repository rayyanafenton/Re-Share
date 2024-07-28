import { getFirestore, collection, updateDoc, doc } from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const updateTransactionPaymentID = async (
  transactionID: any,
  paymentID: any
) => {
  const db = getFirestore(FIREBASE_APP);
  const transactionsCollection = collection(db, "transactions");

  try {
    const transactionDocRef = doc(transactionsCollection, transactionID);
    const transactionDoc = await updateDoc(transactionDocRef, {
      paymentID: paymentID,
    });

    console.log("Transaction paymentID updated successfully");
  } catch (error) {
    console.error("Error updating transaction paymentID:", error);
  }
};

export default updateTransactionPaymentID;
