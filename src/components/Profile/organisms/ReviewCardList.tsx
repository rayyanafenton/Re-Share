import { FlatList, StyleSheet, View } from "react-native";
import React from "react";

import ReviewCard from "../molecules/ReviewCard";

export default function ReviewCardList({ items }: any) {
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(items) => items.id.toString()}
          renderItem={({ item }) => <ReviewCard review={item} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
