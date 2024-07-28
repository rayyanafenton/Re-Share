import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import updateTransactionPaymentID from "../transaction/updateTransactionPaymentID";

const createPayment = async (
  transactionID: any,
  acquirerID: any,
  listerID: any,
  totalPrice: any
) => {
  const db = getFirestore(FIREBASE_APP);
  const paymentsCollection = collection(db, "payments");

  try {
    console.log("enter");
    const transactionDoc = await getDoc(doc(db, "transactions", transactionID));

    if (transactionDoc.exists()) {
      const newPaymentRecord = {
        transactionID: transactionID,
        acquirerID: acquirerID,
        listerID: listerID,
        amount: totalPrice,
      };

      const paymentRef = await addDoc(paymentsCollection, newPaymentRecord);

      console.log("New payment document created");
      const paymentDoc = await getDoc(paymentRef);
      const newPaymentData = paymentDoc.data();

      await updateTransactionPaymentID(transactionID, paymentDoc.id);

      return { id: paymentDoc.id, ...newPaymentData };
    } else {
      console.log("Transaction document does not exist for ID:", transactionID);
    }
  } catch (error) {
    console.error("Error creating a new payment:", error);
  }
};

export default createPayment;
