import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import getListingByName from "../../../helper/listing/getListingByName";

import ListingList from "../organisms/ListingList";
import AppSearchBar from "../molecules/SeachBar";

export default function SearchScreen({ navigation, route }: any) {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [itemListings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector<any, any>((state) => state.user.user);

  const handleGetListing = async () => {
    try {
      setLoading(true);
      const listingData = await getListingByName(user.id, searchPhrase);
      listingData ? setListings(listingData) : setListings([]);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving data:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <AppSearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        handleGetListing={handleGetListing}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <ListingList navigation={navigation} listing={itemListings} />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
  scrollContainer: {
    backgroundColor: "#F8F9FB",
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 18,
    backgroundColor: "#fff",
  },
  searchBar: {
    paddingHorizontal: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    height: 45,
    borderRadius: 15,
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
});
