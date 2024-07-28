import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Divider, SearchBar, Text } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import getListingWithoutUser from "../../../helper/listing/getListingWithoutUser";
import getListingByRedistributionMethod from "../../../helper/listing/getListingByRedistributionMethod";

import ListingList from "../organisms/ListingList";
import CategoryList from "../organisms/CategoryList";
import TagListItem from "../organisms/TagList";
import ListingListHorizontal from "../organisms/ListingListHorizontal";
import SlideAdd from "../molecules/SlideAdd";

import { categories } from "../../../assets/categories";
import getNewListing from "../../../helper/listing/getNewListing";

export default function HomeScreen({ navigation }: any) {
  const [itemListings, setListings] = useState<any[]>([]);
  const [itemNewListings, setNewListings] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const user = useSelector<any, any>((state) => state.user.user);

  const tagOptions = ["All Items", "To Buy", "To Rent", "Get Free"];
  const [selectedTag, setSelectedTag] = useState("All Items");

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const listingData = await getListingWithoutUser(user.id);
          listingData ? setListings(listingData) : "";
          const newListingData = await getNewListing(user.id);
          newListingData ? setNewListings(newListingData) : "";
          setLoading(false);
        } catch (error) {
          console.error("Error retrieving data:", error);
          setLoading(false);
        }
      };

      fetchData();
    }, [user.id])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let listingData: any[] | null;
        if (selectedTag === "All Items") {
          listingData = await getListingWithoutUser(user.id);
        } else {
          let formatSelectedTag;
          selectedTag === "To Buy"
            ? (formatSelectedTag = "Sell")
            : selectedTag === "To Rent"
            ? (formatSelectedTag = "Rent")
            : selectedTag === "Get Free"
            ? (formatSelectedTag = "Donate")
            : "";

          listingData = await getListingByRedistributionMethod(
            user.id,
            formatSelectedTag
          );
        }
        listingData ? setListings(listingData) : "";
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTag]);

  const changeSelectedTag = (text: any) => {
    setSelectedTag(text);
  };

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
      <SlideAdd height={160} navigation={navigation} />

      {/* <View style={styles.sections}>
        <Text style={styles.title}>New Listing</Text>
        </View>
        <ListingListHorizontal
        navigation={navigation}
        listing={itemNewListings}
        /> */}

      <Text style={[styles.title, { marginLeft: 10 }]}>Categories</Text>
      <View style={styles.sections}>
        <CategoryList categories={categories} navigation={navigation} />
      </View>
      <Text style={[styles.title, { marginLeft: 10, marginTop: 10 }]}>
        All Listings
      </Text>

      <TagListItem
        tagOptions={tagOptions}
        navigation={navigation}
        changeSelectedTag={changeSelectedTag}
        selectedTag={selectedTag}
      />
      <ListingList navigation={navigation} listing={itemListings} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  sections: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
