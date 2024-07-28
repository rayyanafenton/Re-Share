// Import necessary Firebase modules
// (Make sure your import statements are correct)
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  query,
  where,
  DocumentData,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";
import createTransaction from "../transaction/createTransaction";
import deleteOffer from "../offer/deleteOffer";
import createNotification from "../notification/createNotification";

async function getOfferWithHighestBidding(listingID: any) {
  const db = getFirestore(FIREBASE_APP);

  const q = query(
    collection(db, "offers"),
    where("listingID", "==", listingID)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const offers = querySnapshot.docs.map((doc) => {
    const data = doc.data() as DocumentData;
    return { id: doc.id, offerData: data };
  });

  const highestBiddingOffer = offers.reduce(
    (maxOffer: any, currentOffer: any) => {
      const maxPrice = parseFloat(maxOffer.offerData.offerPrice);
      const currentPrice = parseFloat(currentOffer.offerData.offerPrice);
      return maxPrice > currentPrice ? maxOffer : currentOffer;
    },
    offers[0]
  );

  return highestBiddingOffer;
}

const closeBidding = async (offersData: any, selectedListing: any) => {
  const db = FIREBASE_DB;
  const listingsCollection = collection(db, "listings");
  const listingDocRef = doc(listingsCollection, selectedListing.id);

  if (offersData.totalOffers > 0) {
    console.log("bid item got offer");
    const highestBidder = await getOfferWithHighestBidding(selectedListing.id);

    await createTransaction(
      selectedListing.id,
      highestBidder.offerData.acquirerID,
      "Ongoing",
      highestBidder.offerData.offerPrice,
      Date.now(),
      true
    );

    await deleteOffer(selectedListing.id, highestBidder.offerData.acquirerID);
    await updateDoc(listingDocRef, { status: "Not available" });
    await createNotification(
      "App",
      selectedListing.itemLister.id,
      "New Transaction",
      selectedListing.itemName,
      selectedListing.imageUris[0],
      Date.now()
    );
    await createNotification(
      "App",
      highestBidder.offerData.acquirerID,
      "Bid Won - Highest Offer",
      selectedListing.itemName,
      selectedListing.imageUris[0],
      Date.now() + 1
    );
  } else {
    if (selectedListing.autoRelist === true) {
      const originalDeadline =
        selectedListing.biddingDeadline instanceof Date
          ? selectedListing.biddingDeadline
          : new Date(selectedListing.biddingDeadline);

      const updatedDeadline = new Date(originalDeadline);
      updatedDeadline.setDate(originalDeadline.getDate() + 3);

      const formattedDate =
        updatedDeadline.getFullYear() +
        "/" +
        (updatedDeadline.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        updatedDeadline.getDate().toString().padStart(2, "0");

      await createNotification(
        "App",
        selectedListing.itemLister.id,
        "Bidding Auto-Relisted",
        `Bidding deadline for ${selectedListing.itemName} is extended to 3 more days`,
        selectedListing.imageUris[0],
        Date.now() + 1
      );
      try {
        await updateDoc(listingDocRef, { biddingDeadline: formattedDate });
        await updateDoc(listingDocRef, { status: "Available" });
      } catch (error) {
        console.error("Error updating biddingDeadline:", error);
      }
    } else {
      console.log("no, auto relist is not true");

      await updateDoc(listingDocRef, { status: "Not available" });
    }
  }
};

export default closeBidding;
