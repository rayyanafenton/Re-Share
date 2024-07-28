import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React from "react";

export default function TagCard({
  tagName,
  changeSelectedTag,
  selectedTag,
}: any) {
  const handlePress = () => {
    if (changeSelectedTag) changeSelectedTag(tagName);
  };

  const background = tagName === selectedTag ? "#0077E6" : "#F8F9FB";
  const textColor = tagName === selectedTag ? "#FFFFFF" : "#000";

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, { backgroundColor: background }]}>
        <Text style={[styles.text, { color: textColor }]}>{tagName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    borderRadius: 20,
    borderColor: "#0077E6",
    borderWidth: 1,
    padding: 4,
  },
  text: {
    color: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
