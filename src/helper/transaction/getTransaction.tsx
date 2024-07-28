import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { FIREBASE_APP } from "../../firebase/Firebaseconfig";

function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

const getTransaction = async () => {
  const db = getFirestore(FIREBASE_APP);

  const transactionsCollection = collection(db, "transactions");
  const listingsCollection = collection(db, "listings");

  const transactionData: any[] = [];

  const transactionsSnapshot = await getDocs(transactionsCollection);
  const listingsSnapshot = await getDocs(listingsCollection);

  const listingsData: Record<string, DocumentData> = {};

  listingsSnapshot.forEach((listingDoc) => {
    const listingId = listingDoc.id;
    listingsData[listingId] = deepCopy(listingDoc.data());
  });

  transactionsSnapshot.forEach((transactionDoc) => {
    const data = transactionDoc.data() as any;
    const id = transactionDoc.id;

    data.listing = listingsData[data.listing];

    transactionData.push({ ...data, id });
  });

  return transactionData;
};

export default getTransaction;
