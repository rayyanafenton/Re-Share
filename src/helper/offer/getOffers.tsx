import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

const getOffers = async (listingID: any) => {
  try {
    const db = getFirestore(FIREBASE_APP);

    const offersCollection = collection(db, "offers");

    const q = query(offersCollection, where("listingID", "==", listingID));

    const querySnapshot = await getDocs(q);

    let totalOffers = querySnapshot.size;
    let highestOfferPrice = 0;
    let acquirerID = ""; // New variable to store acquirerID

    querySnapshot.forEach((doc) => {
      const offerData = doc.data();
      const offerPrice = parseFloat(offerData.offerPrice);

      if (offerPrice > highestOfferPrice) {
        highestOfferPrice = offerPrice;
        acquirerID = offerData.acquirerID; // Store acquirerID when updating highestOfferPrice
      }
    });

    return { totalOffers, highestOfferPrice, acquirerID };
  } catch (error) {
    console.error("Error getting the number of offers:", error);
    throw error;
  }
};

export default getOffers;
