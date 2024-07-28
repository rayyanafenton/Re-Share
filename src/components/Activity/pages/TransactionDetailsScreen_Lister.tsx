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

import addMessage from "../../../helper/message/createMessage";
import getMessageById from "../../../helper/message/getMessageById";
import checkIfMessageExists from "../../../helper/message/isMessageExist";
import checkRatingAndComment from "../../../helper/rating and comment/checkRatingAndComment";
import saveRatingAndComment from "../../../helper/rating and comment/saveRatingAndComment";

import StatusCard from "../molecules/StatusCard";
import showToast from "../../Home/molecules/showToast";
import getTransactionPaymentID from "../../../helper/transaction/getTransactionPaymentID";
import getPayment from "../../../helper/payment/getPayment";
import updateTransactionStatus from "../../../helper/transaction/updateTransactionStatus";
import updatePaymentStatus from "../../../helper/payment/updatePaymentStatus";
import cancelTransaction from "../../../helper/transaction/cancelTransaction";
import createNotification from "../../../helper/notification/createNotification";

export default function TransactionDetailsScreen_Lister({
  route,
  navigation,
}: any) {
  const selectedTransaction = route.params;

  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);

  const [totalPrice, setTotalPrice] = useState(
    parseInt(selectedTransaction.price) *
      (selectedTransaction.totalRentDays > 0
        ? parseInt(selectedTransaction.totalRentDays)
        : 1) +
      (selectedTransaction.listingData.itemDeposit !== ""
        ? parseInt(selectedTransaction.listingData.itemDeposit)
        : 0)
  );

  const [modal, setModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const user = useSelector<any, any>((state) => state.user.user);

  const [paymentData, setPaymentData] = useState<any>();

  useEffect(() => {
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
  }, []);

  const openModal = async () => {
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
    setModal(!modal);
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

  const setPaymentReceived = async () => {
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
        selectedTransaction.acquirerID,
        "Transaction Completed",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      await createNotification(
        "App",
        selectedTransaction.listerID,
        "Transaction Completed",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now()
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
      setLoading(false);
      await createNotification(
        "App",
        selectedTransaction.acquirerID,
        "Transaction Cancelled by Lister",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      await createNotification(
        "App",
        selectedTransaction.listerID,
        "Transaction Cancelled",
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
        selectedTransaction.acquirerID,
        "Transaction Cancelled by Lister",
        selectedTransaction.listingData.itemName,
        selectedTransaction.listingData.imageUris[0],
        Date.now() + 1
      );
      await createNotification(
        "App",
        selectedTransaction.listerID,
        "Transaction Cancelled",
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
        selectedTransaction.acquirerID,
        selectedTransaction.listerID,
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
      setModal(!modal);
    }
  };

  const cancelRateAndComment = async () => {
    try {
      setRating(null);
      setComment("");
    } catch (error) {
      console.log("error", error);
    } finally {
      setModal(!modal);
    }
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
                Minimum booking :{" "}
                {selectedTransaction.listingData.itemRentingMinDays} days
              </Text>
            )}
          {selectedTransaction.listingData.itemRedistributionMethod ===
            "Rent" &&
            selectedTransaction.listingData.itemRentingMaxDays !== "" && (
              <Text style={styles.text}>
                Minimum booking :{" "}
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
                  {selectedTransaction.isOnlinePaymentEnabled &&
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

          {/* ITEM ACQUIRER DETAILS  */}
          <Divider style={styles.divider} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Other User Profile", {
                userInfo: selectedTransaction.itemAcquirer,
              });
            }}
          >
            <View style={styles.horizontalContainer}>
              <View>
                <Text style={styles.subsubTitle}>Item Acquirer</Text>
                {selectedTransaction.itemAcquirer.username && (
                  <Text style={styles.text}>
                    {selectedTransaction.itemAcquirer.username}
                  </Text>
                )}
                {selectedTransaction.itemAcquirer.email && (
                  <Text style={styles.text}>
                    {selectedTransaction.itemAcquirer.email}
                  </Text>
                )}
              </View>
              <View>
                {selectedTransaction.itemAcquirer.photoURL ? (
                  <Avatar
                    size={60}
                    rounded
                    source={{
                      uri: selectedTransaction.itemAcquirer.photoURL,
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
                  Message Acquirer
                </Button>

                {paymentData?.paymentMethod === "Cash" && (
                  <Button
                    buttonStyle={styles.twobutton}
                    onPress={setPaymentReceived}
                  >
                    Payment Received
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
              <Button buttonStyle={styles.twobutton} onPress={openModal}>
                Rate and Comment
              </Button>
            ) : (
              ""
            )}
          </View>
        </View>
        {/*DIALOG BOX */}
        <Dialog isVisible={modal} onBackdropPress={openModal}>
          <Dialog.Title
            title="Rate the Acquirer"
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
    marginBottom: -5,
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
  ratingContainer: {
    marginVertical: 10,
    marginLeft: 10,
    alignItems: "flex-start",
  },
});
