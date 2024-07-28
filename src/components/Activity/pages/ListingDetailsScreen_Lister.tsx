import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Icon, Text, Divider } from "@rneui/themed";
import { useSelector } from "react-redux";

import TagCard from "../../Home/molecules/TagCard";
import SlideImage from "../../ListItem/molecules/SlideImage";

import { getTimeRemaining } from "../../../utils/getTimeRemaining";
import isOfferExist from "../../../helper/offer/isOfferExist";
import getOffers from "../../../helper/offer/getOffers";
import getFormattedDate from "../../../utils/getFormattedDate";

export default function ListingDetails_Lister({ route, navigation }: any) {
  const selectedListing = route.params.listingData;

  const listTime = selectedListing.listTime;

  const user = useSelector<any, any>((state) => state.user.user);

  const [formattedDate, setFormattedDate] = useState("");
  const [formattedDateDeadline, setFormattedDateDeadline] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  const [loading, setLoading] = useState(false);

  const [isOfferMade, setOfferMade] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");

  const [offersData, setOffersData] = useState({
    totalOffers: 0,
    highestOfferPrice: 0,
  });

  useEffect(() => {
    checkIsOfferMade();
    const fetchData = async () => {
      try {
        const data = await getOffers(selectedListing.id);
        setOffersData(data);
      } catch (error) {
        console.error("Error fetching offers data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFormattedDate(getFormattedDate(listTime));
    setFormattedDateDeadline(getFormattedDate(selectedListing.biddingDeadline));

    let intervalId: any;

    if (selectedListing.biddingDeadline) {
      const timeRemainingStr = getTimeRemaining(
        selectedListing.biddingDeadline
      );

      if (timeRemainingStr === "Bidding Ended") {
        clearInterval(intervalId);
        setTimeRemaining(timeRemainingStr);
      } else {
        intervalId = setInterval(() => {
          const timeRemainingStr = getTimeRemaining(
            selectedListing.biddingDeadline
          );

          if (timeRemainingStr === "Bidding Ended") {
            clearInterval(intervalId);
            setTimeRemaining(timeRemainingStr);
          }

          setTimeRemaining(timeRemainingStr);
        }, 1000);
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedListing.biddingDeadline]);

  const checkIsOfferMade = async () => {
    const price = await isOfferExist(selectedListing.id, user.id);
    if (price !== null) {
      setOfferMade(true);
      setOfferPrice(price);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
        {/* ITEM IMAGE */}
        <SlideImage images={selectedListing.imageUris} />
        <View style={styles.container}>
          <View style={styles.containerHorizontal}>
            <TagCard tagName={selectedListing.itemRedistributionMethod} />
          </View>

          {/* ITEM NAME */}
          <View style={{ paddingHorizontal: 10 }}>
            <Text h4 style={{ marginBottom: 15 }}>
              {selectedListing.itemName}
            </Text>

            {/* ITEM PRICE */}
            {selectedListing.itemRedistributionMethod == "Rent" ? (
              <Text style={styles.subTitle}>
                RM {selectedListing.itemPrice}/day
              </Text>
            ) : selectedListing.itemRedistributionMethod == "Donate" ? (
              <Text style={styles.subTitle}>Get Free</Text>
            ) : (
              <Text style={styles.subTitle}>
                RM {selectedListing.itemPrice}
              </Text>
            )}

            {/* ITEM PRICE DETAILS (RENT) */}
            {(selectedListing.itemDeposit !== "" ||
              selectedListing.itemRentingMinDays !== "" ||
              selectedListing.itemRentingMaxDays !== "") && (
              <>
                <Divider style={{ marginVertical: 10, marginTop: 16 }} />
                <Text style={styles.subsubTitle}>Price Details</Text>
              </>
            )}
            {selectedListing.itemRedistributionMethod === "Rent" &&
              selectedListing.itemDeposit !== "" && (
                <Text style={styles.text}>
                  Required Deposit : RM {selectedListing.itemDeposit}
                </Text>
              )}
            {selectedListing.itemRedistributionMethod === "Rent" &&
              selectedListing.itemRentingMinDays !== "" && (
                <Text style={styles.text}>
                  Minimum booking : {selectedListing.itemRentingMinDays} days
                </Text>
              )}
            {selectedListing.itemRedistributionMethod === "Rent" &&
              selectedListing.itemRentingMaxDays !== "" && (
                <Text style={styles.text}>
                  Minimum booking : {selectedListing.itemRentingMaxDays} days
                </Text>
              )}

            {/* ITEM BIDDING DETAILS */}
            {selectedListing.isBid == true && (
              <View style={styles.section}>
                <Divider style={styles.divider} />
                <Text style={styles.subsubTitle}>Bidding Enabled</Text>

                <View style={styles.horizontalContainer}>
                  <Text style={styles.text}>
                    Bid deadline: {formattedDateDeadline}
                  </Text>
                  {timeRemaining === "Bidding Ended" ? (
                    <Text style={[styles.text, { color: "#ff190c" }]}>
                      Bidding Ended
                    </Text>
                  ) : (
                    <Text
                      style={[styles.text, { color: "#0077E6" }]}
                    >{`${timeRemaining}`}</Text>
                  )}
                </View>

                <Text style={styles.text}>
                  Total Bidder: {offersData.totalOffers}
                </Text>
                <Text style={styles.text}>
                  Highest Bid: RM{offersData.highestOfferPrice}
                </Text>
              </View>
            )}

            {/* ITEM CATEGORIES */}
            <View style={styles.section}>
              <Divider style={styles.divider} />
              <Text style={styles.subsubTitle}>Category</Text>
              <Text style={styles.text}>{selectedListing.itemCategory}</Text>
            </View>

            {/* ITEM DETAILS */}
            {selectedListing.itemDescriptions && (
              <View style={styles.section}>
                <Divider style={styles.divider} />
                <Text style={styles.subsubTitle}>Item Details</Text>
                <Text style={styles.text}>
                  {selectedListing.itemDescriptions}
                </Text>
              </View>
            )}

            {/* ITEM CONDITIONS AND NOTE*/}
            <View style={styles.section}>
              <Divider style={styles.divider} />
              <Text style={styles.subsubTitle}>Condition</Text>
              <Text style={styles.text}>{selectedListing.itemCondition}</Text>
              {selectedListing.itemConditionNote && (
                <Text style={styles.text}>
                  Note: {selectedListing.itemConditionNote}
                </Text>
              )}
            </View>

            {(selectedListing.isOnlinePaymentEnabled ||
              selectedListing.meetingAndCollection) && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.subsubTitle}>Deal Preference</Text>
                  <Text style={styles.text}>
                    Payment method: cash
                    {selectedListing.isOnlinePaymentEnabled &&
                      ", online payment"}
                  </Text>
                  {selectedListing.meetingAndCollection && (
                    <Text style={styles.text}>
                      Meeting point:
                      {selectedListing.meetingAndCollection}
                    </Text>
                  )}
                </View>
              </>
            )}

            <Text style={[styles.text, { marginTop: 20 }]}>
              Listed at {formattedDate}
            </Text>
          </View>

          {/* BUTTONS */}
          <View style={{ marginVertical: 80 }}>
            <Button
              buttonStyle={styles.twobutton}
              onPress={() => {
                navigation.navigate("List Item Lister", selectedListing);
              }}
            >
              Manage Listing
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#F8F9FB",
    flex: 1,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  containerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 18,
  },
  subsubTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 5,
  },
  section: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 80,
    marginBottom: 80,
    marginHorizontal: 10,
  },
  twobutton: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  divider: {
    marginVertical: 8,
  },
  text: {
    marginVertical: 3,
    color: "#5A5A5A",
  },
  inputLabel: {
    fontWeight: "600",
    color: "#5A5A5A",
  },
  placeholderStyle: {
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 15,
  },
});
