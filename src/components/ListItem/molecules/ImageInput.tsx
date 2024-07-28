import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "@rneui/themed";

export default function ImageInput({ imageUri, onChangeImage }: any) {
  useEffect(() => {
    // Check and request permission only if it hasn't been granted before
    checkAndRequestPermission();
  }, [imageUri]);

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
        onChangeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const handlePress = () => {
    if (!imageUri) selectImage();
    else
      Alert.alert("Delete", "Are you sure you want to delete this image?", [
        { text: "Yes", onPress: () => onChangeImage(null) },
        { text: "No" },
      ]);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!imageUri && <Icon name="photo-camera" type="material" size={30} />}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    height: 100,
    width: 100,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
