import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import getFilteredListingByUser from "../../../helper/listing/getFilteredListingByUser";

import ListingList from "../../Home/organisms/ListingList";
import getAllListingByUser from "../../../helper/listing/getAllListingByUser";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen_Listing({ navigation, route }: any) {
  const [itemListings, setListings] = useState<any | null[]>([null]);
  const [loading, setLoading] = useState(true);
  const user = useSelector<any, any>((state) => state.user.user);

  useFocusEffect(
    React.useCallback(() => {
      const fetchDataAndLog = async () => {
        try {
          let listingData;
          if (route.params.passUser) {
            listingData = await getFilteredListingByUser(route.params.passUser);
            console.log(route.params.passUser);
          } else {
            listingData = await getAllListingByUser(user.id);
          }
          setListings(listingData);
          setLoading(false);
        } catch (error) {
          console.error("Error retrieving data:", error);
          setLoading(false);
        }
      };
      fetchDataAndLog();
    }, [user.id])
  );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      bounces={false}
      bouncesZoom={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      {route.params.lister ? (
        <ListingList navigation={navigation} listing={itemListings} lister />
      ) : (
        <ListingList navigation={navigation} listing={itemListings} />
      )}
    </ScrollView>
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
