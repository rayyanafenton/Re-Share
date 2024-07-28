import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import ActivityCard from "../molecules/ActivityCard";

export default function ActivityCardList({
  activities,
  navigation,
  lister,
}: any) {
  return (
    <View style={styles.container}>
      {activities.map((activity: any, index: number) => {
        return (
          <ActivityCard
            activity={activity}
            page={() => {
              !lister
                ? activity.activity === "transaction"
                  ? navigation.navigate(
                      "Transaction Details Acquirer",
                      activity,
                      {
                        itemLister: activity.itemLister,
                      }
                    )
                  : navigation.navigate("Listing Details Acquirer", {
                      listingData: activity.listingData,
                      itemLister: activity.itemLister,
                    })
                : activity.activity === "transaction"
                ? navigation.navigate("Transaction Details Lister", activity)
                : navigation.navigate("Listing Details Lister", activity);
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#F8F9FB",
    paddingBottom: 20,
  },
});
