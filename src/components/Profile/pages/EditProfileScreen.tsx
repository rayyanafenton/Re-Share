import {
  Alert,
  ScrollView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import editUser from "../../../helper/user/updateUser";
import updateImageToStorage from "../../../utils/uploadImageToStorage";

import { updateUser } from "../../../redux/userActions";
import showToast from "../../Home/molecules/showToast";

export default function EditProfileScreen({ navigation }: any) {
  const user = useSelector((state: any) => state.user.user);
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    id: user.id,
    authID: user.authID,
    photoURL: user.photoURL,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    checkAndRequestPermission();
  }, [userData.photoURL]);

  const checkAndRequestPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      requestPermission();
    }
  };

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library");
  };

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled) {
        setUserData({ ...userData, photoURL: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const handlePress = () => {
    Alert.alert("Change Image", "Are you sure you want to change this image?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => {
          setUserData({ ...userData, photoURL: null });
          selectImage();
        },
      },
    ]);
  };

  const EditProfile = async () => {
    try {
      setLoading(true);
      console.log(userData);
      const imageURL = await updateImageToStorage(userData.photoURL);
      const updatedUserData = { ...userData, photoURL: imageURL };
      await editUser(user.id, updatedUserData);
      dispatch(updateUser(updatedUserData));
      showToast("User information edited successfully", "Green");
      setLoading(false);
    } catch (error) {
      showToast("Error editing user information", "Red");
      setLoading(false);
    }
  };

  const ChangePassword = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, userData.email);
      console.log("sending: ", userData.email);
      showToast("Password change request is sent to email", "Green");
    } catch (error) {
      showToast("Error changing password", "Red");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.iconContainer}>
          <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.imageContainer}>
              {!userData.photoURL && (
                <Avatar
                  rounded
                  source={{ uri: userData.photoURL }}
                  size={90}
                  containerStyle={styles.container}
                />
              )}
              {userData.photoURL && (
                <Image
                  source={{ uri: userData.photoURL }}
                  style={styles.image}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.form}>
          <Input
            style={styles.inputStyle}
            labelStyle={styles.inputLabel}
            label="Username"
            multiline
            value={userData.username}
            onChangeText={(text: any) => {
              setUserData({ ...userData, username: text });
            }}
          />
          <Input
            style={styles.inputStyle}
            labelStyle={styles.inputLabel}
            label="Email"
            disabled
            multiline
            value={userData.email}
          />
        </View>

        <Button containerStyle={{ marginBottom: 30 }} onPress={ChangePassword}>
          Change Password
        </Button>
        <Button onPress={EditProfile}>Edit Profile</Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingHorizontal: 30,
  },
  form: {
    alignItems: "center",
    marginBottom: 60,
  },
  container: {
    marginVertical: 30,
  },
  inputStyle: {
    fontSize: 14,
  },
  iconContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginVertical: 50,
  },
  inputLabel: {
    color: "#1C1C1C",
    fontWeight: "700",
    marginBottom: 10,
  },
  imageContainer: {
    backgroundColor: "#DDDDDD",
    borderRadius: 50,
    height: 100,
    width: 100,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
