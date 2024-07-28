import { StyleSheet, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import ListingCard from "../molecules/ListingCard";

export default function ListingList({ listing, navigation, lister }: any) {
  const numColumns = 2;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {listing?.map((item: any, index: number) => (
          <View
            style={[
              styles.column,
              index % numColumns === 0 ? styles.leftColumn : {},
            ]}
            key={item.id}
          >
            <ListingCard
              listing={item}
              page={() => {
                !lister
                  ? navigation.push("Listing Details Acquirer", {
                      listingData: item,
                      itemLister: item.itemLister,
                    })
                  : navigation.navigate("List Item Lister", item);
              }}
              lister={lister ? lister : undefined}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  column: {
    flexBasis: "50%",
  },
  leftColumn: {
    flex: 1,
  },
});
