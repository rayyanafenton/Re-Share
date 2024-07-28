import { StyleSheet, View, FlatList } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import ListingCard from "../molecules/ListingCard";

export default function ListingListHorizontal({ listing, navigation }: any) {
  return (
    <View style={styles.container}>
      <FlatList
        data={listing}
        keyExtractor={(items) => items.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            page={() => {
              navigation.navigate("Listing Details Acquirer", {
                listingData: item,
                itemLister: item.itemLister,
              });
            }}
          />
        )}
        horizontal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
