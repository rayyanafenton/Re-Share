import {
  getFirestore,
  collection,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const updatePaymentStatus = async (paymentID: any, paymentStatus: any) => {
  const db = getFirestore(FIREBASE_APP);
  const paymentsCollection = collection(db, "payments");

  try {
    const paymentDocRef = doc(paymentsCollection, paymentID);
    const paymentDoc = await getDoc(paymentDocRef);

    if (paymentDoc.exists()) {
      await updateDoc(paymentDocRef, { status: paymentStatus });

      console.log("Payment status updated successfully");
    } else {
      console.log("No payment found for the given paymentID:", paymentID);
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
};

export default updatePaymentStatus;
