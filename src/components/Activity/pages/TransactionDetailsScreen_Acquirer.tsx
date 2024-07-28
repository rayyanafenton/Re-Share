import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
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
  AirbnbRating,
} from "@rneui/themed";
import { useSelector } from "react-redux";

import updateRentDays from "../../../helper/transaction/updateRentDays";
import getActivityByListingID from "../../../helper/activity/getActivityByListing";
import addMessage from "../../../helper/message/createMessage";
import getMessageById from "../../../helper/message/getMessageById";
import checkIfMessageExists from "../../../helper/message/isMessageExist";
import cancelTransaction from "../../../helper/transaction/cancelTransaction";
import saveRatingAndComment from "../../../helper/rating and comment/saveRatingAndComment";
import checkRatingAndComment from "../../../helper/rating and comment/checkRatingAndComment";
import getPayment from "../../../helper/payment/getPayment";
import updateTransactionStatus from "../../../helper/transaction/updateTransactionStatus";
import updatePaymentStatus from "../../../helper/payment/updatePaymentStatus";
import getTransactionPaymentID from "../../../helper/transaction/getTransactionPaymentID";
import createPayment from "../../../helper/payment/createPayment";
import createNotification from "../../../helper/notification/createNotification";

import StatusCard from "../molecules/StatusCard";
import showToast from "../../Home/molecules/showToast";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

export default function TransactionDetailsScreen_Acquirer({
  route,
  navigation,
}: any) {
  const [selectedTransaction, setSelectedTransaction] = useState(route.params);
  const itemLister = route.params.itemLister;
  const [rentDays, setRentDays] = useState(selectedTransaction.totalRentDays);

  const [totalPrice, setTotalPrice] = useState(
    parseInt(selectedTransaction.price) *
      (selectedTransaction.totalRentDays > 0
        ? parseInt(selectedTransaction.totalRentDays)
        : 1) +
      (selectedTransaction.listingData.itemDeposit !== ""
        ? parseInt(selectedTransaction.listingData.itemDeposit)
        : 0)
  );

  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);

  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

  const [loading, setLoading] = useState(false);
  const user = useSelector<any, any>((state) => state.user.user);

  const [paymentData, setPaymentData] = useState<any>();
  const [error, setError] = useState(false);

  const openModal = () => {
    setModal(!modal);
  };

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          console.log("transaction id", selectedTransaction.transactionID);
          const paymentID = await getTransactionPaymentID(
            selectedTransaction.transactionID
          );
          if (paymentID) {
            const data = await getPayment(paymentID);
            setPaymentData(data);
          }
          if (paymentData) console.log("status", paymentData.status);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching offers data:", error);
        }
      };
      fetchData();
    }, [user.id])
  );

  const fetchData = async (listingID: any) => {
    try {
      const updatedTransaction = await getActivityByListingID(listingID);
      setSelectedTransaction(updatedTransaction[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const submitRentDays = async () => {
    if (
      parseInt(rentDays) <
        parseInt(selectedTransaction.listingData.itemRentingMinDays) ||
      parseInt(rentDays) >
        parseInt(selectedTransaction.listingData.itemRentingMaxDays)
    ) {
      setError(true);
      return;
    }
    setError(false);

    try {
      setLoading(true);
      await updateRentDays(selectedTransaction.listingData.id, rentDays);
      fetchData(selectedTransaction.listingData.id);
      setTotalPrice(() => {
        const basePrice = parseInt(selectedTransaction.price);
        const deposit =
          parseInt(selectedTransaction.listingData.itemDeposit) || 0;
        const rentDaysValue =
          rentDays > 0
            ? parseInt(rentDays)
            : parseInt(selectedTransaction.totalRentDays) || 1;

        return basePrice * rentDaysValue + deposit;
      });

      setModal(!modal);
      showToast("Rent days updated successfully", "Green");
    } catch (error) {
      setModal(!modal);
      showToast("Error updating rent days", "Red");
    } finally {
      setLoading(false);
    }
  };

  const goToMessage = async () => {
    try {
      const messageExists = await checkIfMessageExists(
        selectedTransaction.listerID,
        selectedTransaction.acquirerID,
        selectedTransaction.listingID
      );

      if (messageExists) {
        const existingMessageDetails = await getMessageById(messageExists);

        navigation.navigate("Message Details", existingMessageDetails);
      } else {
        const addedMessageID = await addMessage(
          selectedTransaction.listerID,
          selectedTransaction.acquirerID,
          selectedTransaction.listingID
        );

        if (addedMessageID) {
          const addedMessageDetails = await getMessageById(addedMessageID);
          navigation.navigate("Message Details", addedMessageDetails);
        }
      }
    } catch (error) {
      showToast("Error creating message, please try again", "Red");
    }
  };

  const setPayment = async () => {
    try {
      setLoading(true);
      if (!paymentData) {
        const newPaymentData = await createPayment(
          selectedTransaction.transactionID,
          selectedTransaction.acquirerID,
          selectedTransaction.listerID,
          totalPrice
        );
        setLoading(false);
        navigation.navigate("Payment", {
          newPaymentData: newPaymentData,
          isOnlinePaymentEnabled:
            selectedTransaction.listingData.isOnlinePaymentEnabled,
        });
      } else
        navigation.navigate("Payment", {
          newPaymentData: paymentData,
          isOnlinePaymentEnabled:
            selectedTransaction.listingData.isOnlinePaymentEnabled,
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const setCompleteTransaction = async () => {
    try {
      setLoading(true);
      await updateTransactionStatus(
        selectedTransaction.transactionID,
        "Completed"
      );
      paymentData && (await updatePaymentStatus(paymentData.id, "Successful"));
      setLoading(false);
      await createNotification(
        "App",
        selectedTransaction.listerID,
        "Transaction Completed",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      await createNotification(
        "App",
        selectedTransaction.acquirerID,
        "Transaction Completed",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      showToast("Transaction completed successfully", "Green");
      navigation.goBack();
    } catch (error) {
      showToast("Error completing transaction", "Red");
    }
  };

  const setCancelTransaction = async () => {
    try {
      setLoading(true);
      await cancelTransaction(
        selectedTransaction.listingData.id,
        selectedTransaction.transactionID
      );
      paymentData &&
        (await updatePaymentStatus(paymentData.id, "Unsuccessful"));
      await createNotification(
        "App",
        selectedTransaction.listerID,
        "Transaction Cancelled by Acquirer",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now()
      );
      await createNotification(
        "App",
        selectedTransaction.acquirerID,
        "Transaction Cancelled",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      setLoading(false);
      showToast("Transaction cancelled successfully", "Green");
      navigation.goBack();
    } catch (error) {
      showToast("Error canceling transaction", "Red");
    }
  };

  const setCancelTransactionRefund = async () => {
    try {
      setLoading(true);
      await cancelTransaction(
        selectedTransaction.listingData.id,
        selectedTransaction.transactionID
      );
      paymentData && (await updatePaymentStatus(paymentData.id, "Refund"));
      setLoading(false);
      await createNotification(
        "App",
        selectedTransaction.listerID,
        "Transaction Cancelled by Acquirer",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      await createNotification(
        "App",
        selectedTransaction.acquirerID,
        "Transaction Canceled. Your money has been refund",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      showToast("Transaction cancelled successfully", "Green");
      navigation.goBack();
    } catch (error) {
      showToast("Error canceling transaction", "Red");
    }
  };

  const submitRateAndComment = async () => {
    try {
      setLoading(true);
      let timeStamp = Date.now();
      await saveRatingAndComment(
        selectedTransaction.transactionID,
        selectedTransaction.listerID,
        selectedTransaction.acquirerID,
        rating,
        comment,
        timeStamp
      );
      showToast("Rating and comment submitted successfully", "Green");
      setLoading(false);
    } catch (error) {
      showToast("Error submitting rating and comment", "Red");
    } finally {
      setLoading(false);
      setModal2(!modal2);
    }
  };

  const cancelRateAndComment = async () => {
    try {
      setRating(null);
      setComment("");
    } catch (error) {
      console.log("error", error);
    } finally {
      setModal2(!modal2);
    }
  };

  const openModal2 = async () => {
    try {
      const ratingObj = await checkRatingAndComment(
        selectedTransaction.ratings,
        user.id
      );

      if (ratingObj && ratingObj.ratingData) {
        setComment(ratingObj.ratingData.comment);
        setRating(ratingObj.ratingData.rating);
      }
    } catch (error) {
      console.error("Error fetching rating and comment:", error);
    }
    setModal2(!modal2);
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
        <View style={styles.container}>
          {/* ITEM IMAGE, NAME, PRICE */}
          <View style={styles.containerHorizontal}>
            <Image
              source={{ uri: selectedTransaction.listingData.imageUris[0] }}
              style={styles.image}
              resizeMode="cover"
            />

            <Text style={styles.itemRedistribution}>
              {selectedTransaction.listingData.itemRedistributionMethod}
            </Text>

            <View style={{ marginLeft: 20 }}>
              <View style={styles.statusContainer}>
                <StatusCard
                  name={`${selectedTransaction.status} transaction`}
                  status={selectedTransaction.status}
                />
              </View>

              <Text style={styles.subsubTitle}>
                {selectedTransaction.listingData.itemName}
              </Text>

              {selectedTransaction.listingData.itemRedistributionMethod ===
              "Rent" ? (
                <Text style={styles.subTitle}>
                  RM {selectedTransaction.listingData.itemPrice}/day
                </Text>
              ) : selectedTransaction.listingData.itemRedistributionMethod ==
                "Donate" ? (
                <Text style={styles.subTitle}>Get Free</Text>
              ) : (
                <Text style={styles.subTitle}>
                  RM {selectedTransaction.listingData.itemPrice}
                </Text>
              )}
            </View>
          </View>

          {/* ITEM PRICE DETAILS (RENT) */}
          {(selectedTransaction.listingData.itemDeposit !== "" ||
            selectedTransaction.listingData.itemRentingMinDays !== "" ||
            selectedTransaction.listingData.itemRentingMaxDays !== "") && (
            <>
              <Divider style={{ marginVertical: 10, marginTop: 16 }} />
              <Text style={styles.subsubTitle}>Price Details</Text>
            </>
          )}
          {selectedTransaction.listingData.itemRedistributionMethod ===
            "Rent" &&
            selectedTransaction.listingData.itemDeposit !== "" && (
              <Text style={styles.text}>
                Required Deposit : RM{" "}
                {selectedTransaction.listingData.itemDeposit}
              </Text>
            )}
          {selectedTransaction.listingData.itemRedistributionMethod ===
            "Rent" &&
            selectedTransaction.listingData.itemRentingMinDays !== "" && (
              <Text style={styles.text}>
                Minimum rent days :{" "}
                {selectedTransaction.listingData.itemRentingMinDays} days
              </Text>
            )}
          {selectedTransaction.listingData.itemRedistributionMethod ===
            "Rent" &&
            selectedTransaction.listingData.itemRentingMaxDays !== "" && (
              <Text style={styles.text}>
                Maximum rent days :
                {selectedTransaction.listingData.itemRentingMaxDays} days
              </Text>
            )}

          {/* TOTAL PRICE DETAILS */}
          <View style={styles.totalPriceContainer}>
            {/* BIDDED DETAILS */}
            {selectedTransaction.listingData.isBid === true ? (
              <>
                <View style={styles.horizontalContainer}>
                  <Text style={styles.text}>Final bid price</Text>
                  {selectedTransaction.listingData.itemRedistributionMethod ===
                  "Rent" ? (
                    <Text style={styles.text}>
                      RM {selectedTransaction.price}/day
                    </Text>
                  ) : (
                    <Text style={styles.text}>
                      RM {selectedTransaction.price}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.horizontalContainer}>
                  <Text style={styles.text}>Final price</Text>
                  {selectedTransaction.listingData.itemRedistributionMethod ===
                  "Rent" ? (
                    <Text style={styles.text}>
                      {selectedTransaction.price}/day
                    </Text>
                  ) : (
                    <Text style={styles.text}>{selectedTransaction.price}</Text>
                  )}
                </View>
              </>
            )}

            {/* RENT DAYS */}
            {selectedTransaction.listingData.itemRedistributionMethod ===
              "Rent" && (
              <View style={styles.horizontalContainer}>
                <Text style={styles.text}>Total Rent Days</Text>
                {selectedTransaction.status === "Completed" ||
                (selectedTransaction.status === "Unsuccessful" &&
                  selectedTransaction.totalRentDays !== 0) ? (
                  <Text>{selectedTransaction.totalRentDays}</Text>
                ) : selectedTransaction.totalRentDays !== 0 ? (
                  <Text
                    style={[
                      styles.text,
                      {
                        color: "#0077E6",
                        textDecorationLine: "underline",
                      },
                    ]}
                    onPress={openModal}
                  >
                    {selectedTransaction.totalRentDays}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.text,
                      {
                        color: "#0077E6",
                        textDecorationLine: "underline",
                      },
                    ]}
                    onPress={openModal}
                  >
                    Adjust your rent days
                  </Text>
                )}
              </View>
            )}

            {selectedTransaction.listingData.itemDeposit !== "" && (
              <View style={styles.horizontalContainer}>
                <Text style={styles.text}>Total Deposit</Text>
                <Text style={styles.text}>
                  {selectedTransaction.listingData.itemDeposit}
                </Text>
              </View>
            )}
            <Divider style={{ marginVertical: 5 }} />
            <View style={[styles.horizontalContainer]}>
              <Text style={styles.subsubTitle}>Total Price</Text>
              <Text style={styles.subsubTitle}>RM{totalPrice}</Text>
            </View>
          </View>

          {/* ITEM DEAL PREFERENCE AND COLLECTION POINT */}
          {(selectedTransaction.listingData.isOnlinePaymentEnabled ||
            selectedTransaction.listingData.meetingAndCollection) && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.subsubTitle}>Deal Preference</Text>
                <Text style={styles.text}>
                  Payment method: cash
                  {selectedTransaction.listingData.isOnlinePaymentEnabled &&
                    ", online payment"}
                </Text>
                {selectedTransaction.listingData.meetingAndCollection && (
                  <Text style={styles.text}>
                    {selectedTransaction.listingData.meetingAndCollection}
                  </Text>
                )}
              </View>
            </>
          )}

          {/* ITEM LISTER DETAILS  */}
          <Divider style={styles.divider} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Other User Profile", {
                userInfo: itemLister,
              });
            }}
          >
            <View style={styles.horizontalContainer}>
              <View>
                <Text style={styles.subsubTitle}>Item Lister</Text>
                {itemLister.username && (
                  <Text style={styles.text}>{itemLister.username}</Text>
                )}
                {itemLister.email && (
                  <Text style={styles.text}>{itemLister.email}</Text>
                )}
              </View>
              <View>
                {itemLister.photoURL ? (
                  <Avatar
                    size={60}
                    rounded
                    source={{
                      uri: itemLister.photoURL,
                    }}
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

          {/* BUTTONS */}
          <View style={{ marginVertical: 80 }}>
            {selectedTransaction.status === "Ongoing" ? (
              <>
                <Button buttonStyle={styles.twobutton} onPress={goToMessage}>
                  Message Lister
                </Button>

                {(paymentData?.status && paymentData.status !== "Failed") ||
                totalPrice === 0 ? (
                  <Button
                    buttonStyle={styles.twobutton}
                    onPress={setCompleteTransaction}
                  >
                    Item Received
                  </Button>
                ) : (
                  <Button buttonStyle={styles.twobutton} onPress={setPayment}>
                    Make Payment
                  </Button>
                )}

                {paymentData?.status === "Completed" ? (
                  <Button
                    buttonStyle={styles.twobutton}
                    onPress={setCancelTransactionRefund}
                  >
                    Cancel Transaction
                  </Button>
                ) : (
                  <Button
                    buttonStyle={styles.twobutton}
                    onPress={setCancelTransaction}
                  >
                    Cancel Transaction
                  </Button>
                )}
              </>
            ) : selectedTransaction.status === "Completed" ||
              selectedTransaction.status === "Unsuccessful" ? (
              <Button buttonStyle={styles.twobutton} onPress={openModal2}>
                Rate and Comment
              </Button>
            ) : (
              ""
            )}
          </View>

          {/*DIALOG BOX */}
          <Dialog isVisible={modal} onBackdropPress={openModal}>
            <Dialog.Title title="Adjust rent days"></Dialog.Title>

            <Input
              style={styles.placeholderStyle}
              labelStyle={styles.inputLabel}
              containerStyle={styles.inputContainer}
              label="Rent Days"
              keyboardType="numeric"
              placeholder={`e.g. 10`}
              onChangeText={(value: any) => setRentDays(value)}
              value={rentDays}
            />
            {error && (
              <Text style={{ color: "red" }}>
                Booking days must be within the allowed range (between minimum
                and maximum rent days)
              </Text>
            )}

            <Dialog.Actions>
              <Dialog.Button
                title="CONFIRM"
                onPress={() => {
                  submitRentDays();
                }}
              />
              <Dialog.Button
                title="CANCEL"
                onPress={() => {
                  setRentDays(selectedTransaction.totalRentDays);
                  setError(false);
                  openModal();
                }}
              />
            </Dialog.Actions>
          </Dialog>

          {/*DIALOG BOX */}
          <Dialog isVisible={modal2} onBackdropPress={openModal2}>
            <Dialog.Title
              title="Rate the Lister"
              titleStyle={{
                alignSelf: "center",
                textAlign: "center",
              }}
            ></Dialog.Title>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { marginLeft: 10 }]}>Rate</Text>
            </View>
            <AirbnbRating
              count={5}
              defaultRating={rating ? rating : 0}
              size={25}
              showRating={false}
              ratingContainerStyle={styles.ratingContainer}
              onFinishRating={(value: any) => {
                setRating(value);
              }}
            />
            <Input
              style={styles.placeholderStyle}
              labelStyle={styles.inputLabel}
              containerStyle={styles.inputContainer}
              label="Comment"
              placeholder={"Share your comment"}
              multiline
              onChangeText={(value: any) => {
                setComment(value);
              }}
              value={comment}
            />

            <Dialog.Actions>
              <Dialog.Button
                title="SAVE"
                onPress={() => {
                  submitRateAndComment();
                }}
              />
              <Dialog.Button
                title="CANCEL"
                onPress={() => {
                  cancelRateAndComment();
                }}
              />
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
    paddingHorizontal: 25,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBBBBB",
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 18,
    marginTop: 5,
  },
  subsubTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 50,
    marginBottom: 50,
    marginHorizontal: 30,
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
    color: "#000000",
  },
  placeholderStyle: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 0,
    width: 50,
  },
  statusContainer: {
    marginBottom: 15,
    justifyContent: "flex-start",
    marginTop: 5,
  },
  twobutton: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  totalPriceContainer: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#BBBBBB",
  },
  itemRedistribution: {
    fontSize: 12,
    backgroundColor: "#0077E6",
    color: "#FFFFFF",
    paddingHorizontal: 5,
    marginTop: 6,
    position: "absolute",
    top: 1.3,
  },
  inputLabel: {
    fontWeight: "600",
    color: "#5A5A5A",
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
  ratingContainer: {
    marginVertical: 10,
    marginLeft: 10,
    alignItems: "flex-start",
  },
});
