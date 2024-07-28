import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const getPayment = async (paymentID: any) => {
  const db = getFirestore(FIREBASE_APP);
  const paymentsCollection = collection(db, "payments");
  const paymentDocRef = doc(paymentsCollection, paymentID);

  try {
    const paymentDoc = await getDoc(paymentDocRef);

    if (paymentDoc.exists()) {
      const paymentData = paymentDoc.data();
      return { id: paymentDoc.id, ...paymentData };
    } else {
      console.log("Payment document does not exist for ID:", paymentID);
      return null;
    }
  } catch (error) {
    console.error("Error getting payment data:", error);
    return null;
  }
};

export default getPayment;
