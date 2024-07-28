import { StyleSheet, View, FlatList } from "react-native";
import React from "react";

import CategoryCard from "../molecules/CategoryCard";

export default function CategoryList({ categories, navigation }: any) {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(categories) => categories.label}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            page={() => navigation.navigate("Category", item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "transparent",
    marginLeft: 5,
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
