import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React from "react";

export default function StatusCard({ name, status }: any) {
  let backgroundColor, textColor, borderColor;

  switch (status) {
    case "Ongoing":
      backgroundColor = "#DBF3FA";
      textColor = "#0077E6";
      borderColor = "#0077E6";
      break;
    case "Completed":
      backgroundColor = "#EDF9EB";
      textColor = "#008631";
      borderColor = "#008631";
      break;
    default:
      backgroundColor = "#FFCBD1";
      textColor = "#C30010";
      borderColor = "#C30010";
      break;
  }
  const containerWidth = name.length * 8;
  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          styles.container,
          { backgroundColor, borderColor, width: containerWidth },
        ]}
      >
        <Text style={[styles.text, { color: textColor }]}>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderWidth: 1,
    padding: 4,
  },
  text: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
