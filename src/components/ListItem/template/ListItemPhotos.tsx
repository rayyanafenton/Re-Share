import { StyleSheet, View } from "react-native";
import React, { useState } from "react";

import ImageInputList from "../organisms/ImageInputList";

export default function ListItemPhotos({ imageUris, handleSetItems }: any) {
  const handleAdd = (uri: string) => {
    handleSetItems([...imageUris, uri], "imageUris");
  };

  const handleRemove = (uri: string) => {
    handleSetItems(
      imageUris.filter((imageUri: any) => imageUri !== uri),
      "imageUris"
    );
  };

  return (
    <View style={styles.container}>
      <ImageInputList
        imageUris={imageUris}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    marginHorizontal: 30,
    marginTop: 20,
  },
});
