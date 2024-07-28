//ListItemDeleteAction.js
import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ListItemDeleteAction({ onPress }: any) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="trash-can"
          size={35}
          color={"#FFFFFF"}
        ></MaterialCommunityIcons>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ListItemDeleteAction;
