import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import getLikedListings from "../../../helper/listing/getLikedListings";

import ListingList from "../organisms/ListingList";

export default function LikeScreen({ navigation }: any) {
  const [itemListings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector<any, any>((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingData = await getLikedListings(user.id);
        listingData ? setListings(listingData) : "";
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        bounces={false}
        bouncesZoom={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <ListingList navigation={navigation} listing={itemListings} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
