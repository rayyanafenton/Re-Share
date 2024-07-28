import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text, Card, Icon } from "@rneui/themed";

export default function CategoryCard({ category, page }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={page}
      style={{ alignItems: "center" }}
    >
      <View style={styles.container}>
        <Icon
          type="material-community"
          name={category.icon}
          size={33}
          color={category.color}
        />
      </View>
      <Text style={styles.text}>{category.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    width: 58,
    height: 58,
    marginHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 8,
    backgroundColor: "#E8ECF0",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapperContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 10,
    fontWeight: "400",
    maxWidth: 60,
    textAlign: "center",
    justifyContent: "center",
    marginTop: 5,
  },
});
