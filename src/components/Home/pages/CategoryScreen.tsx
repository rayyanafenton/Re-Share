import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector } from "react-redux";

import getListingByCategory from "../../../helper/listing/getListingByCategory";

import ListingList from "../organisms/ListingList";
import { categoryLabel } from "../../../assets/categories";

export default function CategoryScreen({ navigation, route }: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params.label);
  const [items, setItems] = useState(categoryLabel);

  const [itemListings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector<any, any>((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      if (value !== null) {
        try {
          setLoading(true);
          const listingData = await getListingByCategory(user.id, value);
          listingData ? setListings(listingData) : "";
          setLoading(false);
        } catch (error) {
          console.error("Error retrieving data:", error);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [value]);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginHorizontal: 30,
          marginVertical: 20,
          marginBottom: open ? 220 : 20,
        }}
      >
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          textStyle={styles.textCategory}
          listMode="SCROLLVIEW"
          placeholder="Select a category"
          dropDownContainerStyle={{
            borderColor: "#748C94",
            elevation: 15,
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          style={{
            borderColor: "#748C94",
          }}
        />
      </View>

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
  scrollContainer: {
    backgroundColor: "#F8F9FB",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  textCategory: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
