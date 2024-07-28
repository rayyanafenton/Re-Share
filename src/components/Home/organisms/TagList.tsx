import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import TagCard from "../molecules/TagCard";

export default function TagListItem({
  tagOptions,
  changeSelectedTag,
  selectedTag,
}: any) {
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={tagOptions}
          keyExtractor={(option) => option.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ margin: 5 }}>
              <TagCard
                tagName={item}
                changeSelectedTag={changeSelectedTag}
                selectedTag={selectedTag}
              />
            </View>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
});
