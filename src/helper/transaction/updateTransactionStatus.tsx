import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const updateTransactionStatus = async (
  transactionID: string,
  transactionStatus: any
) => {
  try {
    const db = FIREBASE_DB;
    const transactionsCollection = "transactions";

    const transactionRef = doc(db, transactionsCollection, transactionID);

    await updateDoc(transactionRef, { status: transactionStatus });

    console.log(`Transaction with ID ${transactionID} completed successfully.`);
  } catch (error) {
    console.error("Error completing transaction:", error);
  }
};

export default updateTransactionStatus;
