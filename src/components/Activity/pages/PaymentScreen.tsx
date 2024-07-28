import { StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { CheckBox, Divider } from "@rneui/base";
import { Button } from "@rneui/themed";

import setTransactionPaymentMethod from "../../../helper/payment/setTransactionPaymentMethod";

export default function PaymentScreen({ route, navigation }: any) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("");
  const [showOnlinePaymentOption, setShowOnlinePaymentOption] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const paymentData = route.params.newPaymentData;

  const checkData = () => {
    if (!paymentMethod) {
      setErrorMessage(true);
      return false;
    }

    if (paymentMethod === "Online Payment" && !onlinePaymentMethod) {
      setErrorMessage(true);
      return false;
    }

    setErrorMessage(false);
    return true;
  };

  const makePayment = async () => {
    if (checkData()) {
      try {
        const updatedPaymentData = await setTransactionPaymentMethod(
          paymentData.id,
          paymentMethod,
          onlinePaymentMethod
        );
        if (paymentMethod === "Online Payment")
          navigation.navigate("Online Payment", updatedPaymentData);
        else navigation.goBack();
      } catch (error) {
        console.log("Error in creating payment collection");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Choose a payment method</Text>
      <CheckBox
        title="Online Payment"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        disabled={!route.params.isOnlinePaymentEnabled}
        checked={showOnlinePaymentOption && paymentMethod === "Online Payment"}
        onPress={() => {
          setShowOnlinePaymentOption(!showOnlinePaymentOption);
          setPaymentMethod("Online Payment");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showOnlinePaymentOption && (
        <View>
          <CheckBox
            title="Maybank2U"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={onlinePaymentMethod === "Maybank2U"}
            onPress={() => {
              setOnlinePaymentMethod(
                onlinePaymentMethod === "Maybank2U" ? "" : "Maybank2U"
              );
            }}
            textStyle={{ fontWeight: "500" }}
            containerStyle={styles.checkBoxContainerInside}
          />
          <CheckBox
            title="GrabPay"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={onlinePaymentMethod === "GrabPay"}
            onPress={() => {
              setOnlinePaymentMethod(
                onlinePaymentMethod === "GrabPay" ? "" : "GrabPay"
              );
            }}
            textStyle={{ fontWeight: "500" }}
            containerStyle={styles.checkBoxContainerInside}
          />
          <CheckBox
            title="Credit/Debit Card"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={onlinePaymentMethod === "Credit/Debit Card"}
            onPress={() => {
              setOnlinePaymentMethod(
                onlinePaymentMethod === "Credit/Debit Card"
                  ? ""
                  : "Credit/Debit Card"
              );
            }}
            textStyle={{ fontWeight: "500" }}
            containerStyle={styles.checkBoxContainerInside}
          />
          <Divider
            style={{ marginHorizontal: 30, marginTop: 20, marginBottom: 10 }}
          />
        </View>
      )}

      <CheckBox
        title="Cash"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={paymentMethod === "Cash"}
        onPress={() => {
          setPaymentMethod("Cash");
          setOnlinePaymentMethod("");
          if (showOnlinePaymentOption === true)
            setShowOnlinePaymentOption(false);
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />
      {errorMessage && (
        <Text style={styles.errorText}>Please select a payment method</Text>
      )}

      <View style={styles.button}>
        <Button onPress={makePayment}>Continue</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    flex: 1,
    paddingTop: 25,
  },
  checkBoxContainer: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    backgroundColor: "#F8F9FB",
  },
  checkBoxContainerInside: {
    paddingHorizontal: 60,
    paddingVertical: 10,
    backgroundColor: "#F8F9FB",
  },
  checkboxTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#5A5A5A",
    backgroundColor: "#F8F9FB",
  },
  text: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 10,
    marginHorizontal: 40,
    marginTop: 20,
    color: "#1C1C1C",
    marginBottom: 25,
  },
  button: {
    marginHorizontal: 30,
    marginVertical: 80,
  },
  errorText: {
    color: "red",
    marginLeft: 30,
    marginVertical: 15,
  },
});
