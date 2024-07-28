import {
  getFirestore,
  collection,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const updateTransactionPaymentMethod = async (
  paymentID: any,
  paymentMethod: any,
  onlinePaymentMethod: any
) => {
  const db = getFirestore(FIREBASE_APP);
  const paymentsCollection = collection(db, "payments");
  const paymentDocRef = doc(paymentsCollection, paymentID);

  try {
    const paymentDoc = await getDoc(paymentDocRef);

    if (paymentDoc.exists()) {
      await updateDoc(paymentDocRef, {
        paymentMethod: paymentMethod,
        onlinePaymentMethod: onlinePaymentMethod,
        status: "Pending",
      });

      console.log("Payment method updated successfully");

      const updatedPaymentDoc = await getDoc(paymentDocRef);
      const updatedPaymentData = updatedPaymentDoc.data();

      return { id: paymentID, ...updatedPaymentData };
    } else {
      console.log("No payment found for the given paymentID:", paymentID);
    }
  } catch (error) {
    console.error("Error updating payment method:", error);
  }
};

export default updateTransactionPaymentMethod;
