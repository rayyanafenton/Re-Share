import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const getUserByAuthID = async (authID: string) => {
  const db = FIREBASE_DB;
  const userCollections = collection(db, "users");

  try {
    // Create a query to find the user with the specified authID
    const q = query(userCollections, where("authID", "==", authID));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      // Assuming there is only one user with a given authID
      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...userDoc.data() };
      console.log(userData);
      return userData;
    } else {
      console.error("User not found with the specified authID");
    }
  } catch (error) {
    console.error("Error fetching user by authID:", error);
  }
};

export default getUserByAuthID;
