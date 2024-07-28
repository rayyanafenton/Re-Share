import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import React, { useState } from "react";
import { Button } from "@rneui/themed";
import showToast from "../../Home/molecules/showToast";
import updatePaymentStatus from "../../../helper/payment/updatePaymentStatus";

export default function OnlinePaymentScreen({ route, navigation }: any) {
  const paymentData = route.params;
  console.log("paymentData", paymentData);
  const [loading, setLoading] = useState(false);

  const handlePaymentStatus = async (status: string) => {
    try {
      setLoading(true);
      const paymentStatus = await updatePaymentStatus(paymentData.id, status);
      setLoading(false);

      let message = "";

      if (status === "Completed") {
        message = "Payment completed successfully";
      } else if (status === "Failed") {
        message = "Payment failed. Please try again.";
      } else {
        message = `Unknown payment status: ${status}`;
      }

      Alert.alert("Payment Status", message, [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      showToast("Error updating payment", "Red");
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
    <View style={styles.container}>
      <Button
        onPress={() => handlePaymentStatus("Completed")}
        style={styles.button}
      >
        Successful
      </Button>
      <View style={{ marginTop: 30 }} />
      <Button
        onPress={() => handlePaymentStatus("Failed")}
        style={styles.button}
      >
        Unsuccessful
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    flex: 1,
    paddingTop: 25,
    marginHorizontal: 30,
  },
  button: {
    marginHorizontal: 30,
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
