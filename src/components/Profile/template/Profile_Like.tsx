import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import getLikedListings from "../../../helper/listing/getLikedListings";

import ListingList from "../../Home/organisms/ListingList";

export default function ProfileScreen_Like({ navigation, route }: any) {
  const [itemListings, setListings] = useState<any | null[]>([null]);
  const [loading, setLoading] = useState(true);
  const user = useSelector<any, any>((state) => state.user.user);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      try {
        let listingData;
        if (route.params && route.params.passUser) {
          listingData = await getLikedListings(route.params.passUser);
        } else {
          listingData = await getLikedListings(user.id);
        }

        if (itemListings !== null) setListings(listingData);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving data:", error);
        setLoading(false);
      }
    };

    fetchDataAndLog();
  }, [user.id]);

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
      <ListingList navigation={navigation} listing={itemListings} />
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
