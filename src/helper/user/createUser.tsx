import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/Firebaseconfig";

// Assuming you have a Firestore instance (replace 'yourFirestoreInstance' accordingly)
const createUser = async (email: any, username: any, authID: any) => {
  const db = FIREBASE_DB;
  const userCollections = collection(db, "users");

  const newUser = {
    email: `${email}`,
    username: `${username}`,
    authID: `${authID}`,
    photoURL:
      "https://i.pinimg.com/564x/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg",
  };

  try {
    const docRef = await addDoc(userCollections, newUser);
    console.log("New user document created with ID:", docRef.id);

    // Fetch the created user document to get its data
    const createdUserDoc = await getDoc(doc(userCollections, docRef.id));
    if (createdUserDoc.exists()) {
      const createdUser = { id: docRef.id, ...newUser };
      console.log(createdUser);
      return createdUser;
    } else {
      console.error("User document not found after creation");
    }
  } catch (error) {
    console.error("Error creating a new user document:", error);
  }
};

export default createUser;
