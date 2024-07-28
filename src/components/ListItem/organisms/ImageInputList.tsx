import { ScrollView, StyleSheet, View } from "react-native";
import React, { useRef } from "react";

import ImageInput from "../molecules/ImageInput";

export default function ImageInputList({
  imageUris = [],
  onAddImage,
  onRemoveImage,
}: any) {
  const scrollView = useRef<ScrollView>(null);

  const handleContentSizeChange = () => {
    scrollView.current?.scrollToEnd();
  };

  return (
    <ScrollView
      ref={scrollView}
      horizontal
      onContentSizeChange={handleContentSizeChange}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {imageUris.map((uri: any, index: any) => (
          <View key={index} style={styles.image}>
            <ImageInput
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
          </View>
        ))}
        <ImageInput
          onChangeImage={(uri: any) => onAddImage(uri || "")}
          imageUri={null}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    marginRight: 10,
  },
});
