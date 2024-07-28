import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  Icon,
  Input,
  Text,
  Divider,
} from "@rneui/themed";
import { useSelector } from "react-redux";

import createTransaction from "../../../helper/transaction/createTransaction";
import createOffer from "../../../helper/offer/createOffer";
import checkOfferExistence from "../../../helper/offer/isOfferExist";
import deleteOffer from "../../../helper/offer/deleteOffer";
import modifyOfferPrice from "../../../helper/offer/updateOfferPrice";
import getOffers from "../../../helper/offer/getOffers";
import checkLike from "../../../helper/like/isLikeExist";
import removeLike from "../../../helper/like/deleteLike";
import addLike from "../../../helper/like/createLike";
import getFormattedDate from "../../../utils/getFormattedDate";
import { getTimeRemaining } from "../../../utils/getTimeRemaining";
import createNotification from "../../../helper/notification/createNotification";

import TagCard from "../../Home/molecules/TagCard";
import SlideImage from "../../ListItem/molecules/SlideImage";
import showToast from "../../Home/molecules/showToast";

export default function ListingDetailsScreen_Acquirer({
  route,
  navigation,
}: any) {
  const selectedListing = route.params.listingData;
  const listingLister = route.params.itemLister;
  const listTime = selectedListing.listTime;

  const [modal, setModal] = useState(false);

  const user = useSelector<any, any>((state) => state.user.user);

  const [formattedDate, setFormattedDate] = useState("");
  const [formattedDateDeadline, setFormattedDateDeadline] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  const [isOfferMade, setOfferMade] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");

  const [offersData, setOffersData] = useState({
    totalOffers: 0,
    highestOfferPrice: 0,
    acquirerID: "",
  });

  const [loading, setLoading] = useState(false);

  const [iconColor, setIconColor] = useState("#585858");
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(false);

  const checkIsOfferMade = async () => {
    const price = await checkOfferExistence(selectedListing.id, user.id);
    if (price !== null) {
      setOfferMade(true);
      setOfferPrice(price);
    }
  };

  const getOfferData = async () => {
    checkIsOfferMade();
    try {
      const data = await getOffers(selectedListing.id);
      setOffersData(data);
      const like = await checkLike(selectedListing.id, user.id);
      setLiked(like);
      like ? setIconColor("#FF190C") : setIconColor("#585858");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching offers data:", error);
    }
  };

  useEffect(() => {
    getOfferData();
  }, []);

  useEffect(() => {
    let intervalId: any;

    const fetchData = async () => {
      setFormattedDate(getFormattedDate(listTime));
      setFormattedDateDeadline(
        getFormattedDate(selectedListing.biddingDeadline)
      );

      if (selectedListing.biddingDeadline) {
        const timeRemainingStr = getTimeRemaining(
          selectedListing.biddingDeadline
        );
        console.log("remaining time: ", timeRemainingStr);

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
    };

    fetchData();
    return () => clearInterval(intervalId);
  }, [listTime, selectedListing]);

  const handleLikePressed = async () => {
    if (liked) {
      await removeLike(selectedListing.id, user.id);
      setLiked(false);
      setIconColor("#BBBBBB");
    } else {
      await addLike(selectedListing.id, user.id);
      setLiked(true);
      setIconColor("#FF190C");
    }
  };

  const makeOffer = async () => {
    const currentDate = new Date();
    const dateString = currentDate.toISOString();
    if (offersData.highestOfferPrice) {
      if (parseFloat(offerPrice) <= offersData.highestOfferPrice) {
        setError(true);
        return;
      }
    }
    if (parseFloat(offerPrice) < parseFloat(selectedListing.itemPrice)) {
      setError(true);
      return;
    }
    setError(false);

    try {
      await createOffer(selectedListing.id, user.id, dateString, offerPrice);
      setModal(!modal);
      showToast("Offer created successfully", "Green");
      navigation.navigate("Activity Tab");
      setOfferPrice("");
      const data = await getOffers(selectedListing.id);
      setOffersData(data);
      await createNotification(
        "App",
        listingLister.id,
        "New Offer",
        selectedListing.itemName,
        selectedListing.imageUris[0],
        Date.now() + 1
      );
    } catch (error) {
      setModal(!modal);
      showToast("Error creating offer", "Red");
      setOfferPrice("");
    }
  };

  const changeOffer = async () => {
    if (offersData.highestOfferPrice) {
      if (parseFloat(offerPrice) <= offersData.highestOfferPrice) {
        setError(true);
        return;
      }
    }
    if (parseFloat(offerPrice) < parseFloat(selectedListing.itemPrice)) {
      setError(true);
      return;
    }
    setError(false);
    try {
      await modifyOfferPrice(selectedListing.id, user.id, offerPrice);
      setModal(!modal);
      showToast("Offer updated successfully", "Green");
      setOfferPrice("");
      const data = await getOffers(selectedListing.id);
      setOffersData(data);
    } catch (error) {
      setModal(!modal);
      showToast("Error updating offer", "Red");
      setOfferPrice("");
    }
  };

  const cancelOffer = async () => {
    try {
      await deleteOffer(selectedListing.id, user.id);
      showToast("Offer cancelled successfully", "Green");
      navigation.goBack();
    } catch (error) {
      showToast("Error canceling offer", "Red");
    }
  };

  const makeTransaction = async () => {
    const currentDate = new Date();
    const dateString = currentDate.toISOString();
    const status = "Ongoing";

    try {
      await createTransaction(
        selectedListing.id,
        user.id,
        status,
        selectedListing.itemPrice,
        dateString,
        false
      );
      await createNotification(
        "App",
        listingLister.id,
        "New Transaction",
        selectedListing.itemName,
        selectedListing.imageUris[0],
        Date.now() + 1
      );
      showToast("Transaction created successfully", "Green");
      navigation.navigate("Activity Tab");
    } catch (error) {
      showToast("Error creating transaction", "Red");
    }
  };

  const openModal = () => {
    setModal(!modal);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
            <Icon
              name="favorite"
              type="material"
              color={iconColor}
              size={30}
              onPress={handleLikePressed}
            />
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
                      Meeting point: {selectedListing.meetingAndCollection}
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* ITEM LISTER DETAILS */}
            <Divider style={styles.divider} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Other User Profile", {
                  userInfo: listingLister,
                });
              }}
            >
              <View style={styles.horizontalContainer}>
                <View>
                  <Text style={styles.subsubTitle}>Listed by</Text>
                  {listingLister.username && (
                    <Text style={styles.text}>{listingLister.username}</Text>
                  )}
                  {selectedListing.itemLister.email && (
                    <Text style={styles.text}>{listingLister.email}</Text>
                  )}
                </View>
                <View>
                  {listingLister.photoURL ? (
                    <Avatar
                      size={60}
                      rounded
                      source={{ uri: listingLister.photoURL }}
                    />
                  ) : (
                    <Icon
                      type="material"
                      name="account-circle"
                      size={60}
                      color="#748C94"
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>

            <Text style={[styles.text, { marginTop: 20 }]}>
              Listed at {formattedDate}
            </Text>
          </View>

          {/* BUTTONS */}
          {isOfferMade === true ? (
            <View style={{ marginVertical: 80 }}>
              <Button buttonStyle={styles.twobutton} onPress={openModal}>
                Change Offer
              </Button>
              <Button buttonStyle={styles.twobutton} onPress={cancelOffer}>
                Cancel Offer
              </Button>
            </View>
          ) : selectedListing.isBid === true ? (
            <Button buttonStyle={styles.button} onPress={openModal}>
              Make Offer
            </Button>
          ) : (
            <Button buttonStyle={styles.button} onPress={makeTransaction}>
              Get Item
            </Button>
          )}

          {/*DIALOG BOX */}
          <Dialog isVisible={modal} onBackdropPress={openModal}>
            <Dialog.Title title="Enter Offer Amount">
              <Text>Enter Offer Amount</Text>
            </Dialog.Title>

            <Input
              style={styles.placeholderStyle}
              labelStyle={styles.inputLabel}
              containerStyle={styles.inputContainer}
              label="Offer Amount"
              placeholder={`Start from RM ${selectedListing.itemPrice}`}
              multiline={true}
              keyboardType="numeric"
              onChangeText={setOfferPrice}
              value={offerPrice}
            />
            {error && (
              <Text style={{ color: "red" }}>
                The offered amount must be at least the starting price and
                cannot be less than or equal to the current highest offer.
              </Text>
            )}

            <Dialog.Actions>
              <Dialog.Button
                title="CONFIRM"
                onPress={() => {
                  isOfferMade ? changeOffer() : makeOffer();
                }}
              />
              <Dialog.Button title="CANCEL" onPress={openModal} />
            </Dialog.Actions>
          </Dialog>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
