import { doc, updateDoc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

const updateUser = async (userId: string, updatedUserInfo: any) => {
  const db = FIREBASE_DB;
  const userDocRef = doc(db, "users", userId);

  try {
    // Fetch the existing user document
    const existingUserDoc = await getDoc(userDocRef);

    if (existingUserDoc.exists()) {
      // Merge the existing user data with the updated information
      const updatedUser = {
        ...existingUserDoc.data(),
        ...updatedUserInfo,
      };

      // Update the user document with the merged data
      await updateDoc(userDocRef, updatedUser);
      console.log("User document updated successfully:", userId);

      // Fetch the updated user document to get its data
      const updatedUserDoc = await getDoc(userDocRef);
      if (updatedUserDoc.exists()) {
        const updatedUserResult = { id: userId, ...updatedUserDoc.data() };
        console.log(updatedUserResult);
        return updatedUserResult;
      } else {
        console.error("Updated user document not found");
      }
    } else {
      console.error("User document not found");
    }
  } catch (error) {
    console.error("Error updating user document:", error);
  }
};

export default updateUser;
