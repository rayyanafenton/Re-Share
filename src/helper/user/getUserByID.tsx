import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const getUserById = async (userId: string) => {
  const db = FIREBASE_DB;
  const usersCollection = "users"; // Replace with the actual name of your collection

  // Create a reference to the user document by ID
  const userDocRef = doc(db, usersCollection, userId);

  try {
    // Get the user document data
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // User document exists, return the user data with the added ID
      const userData = {
        id: userId,
        ...userDocSnapshot.data(),
      };
      return userData;
    } else {
      // User document does not exist
      console.error("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting user by ID:", error);
    // Handle the error accordingly
    return null;
  }
};

export default getUserById;
