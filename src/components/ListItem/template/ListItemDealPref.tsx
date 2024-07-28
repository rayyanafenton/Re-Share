import { StyleSheet, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { CheckBox, Input } from "@rneui/themed";

export default function ListItemDealPref({
  meetingAndCollection,
  isOnlinePaymentEnabled,
  handleSetItems,
  redistributionMethod,
}: any) {
  const [isOnlinePaymentEnabledLocal, setIsOnlinePaymentEnabledLocal] =
    useState(isOnlinePaymentEnabled);
  const [meetingnColLocal, setMeetingnColLocal] =
    useState(meetingAndCollection);

  const handleBlurMeeting = useCallback(() => {
    if (meetingnColLocal !== meetingAndCollection) {
      handleSetItems(meetingnColLocal, "meetingAndCollection");
    }
  }, [meetingnColLocal, meetingAndCollection, handleSetItems]);

  useEffect(() => {
    if (
      isOnlinePaymentEnabled !== isOnlinePaymentEnabledLocal ||
      meetingAndCollection !== meetingnColLocal
    ) {
      setIsOnlinePaymentEnabledLocal(isOnlinePaymentEnabled);
      setMeetingnColLocal(meetingAndCollection);
    }
  }, [isOnlinePaymentEnabled, meetingAndCollection]);

  return (
    <View style={styles.container}>
      <CheckBox
        title="Enable online payment"
        checked={isOnlinePaymentEnabledLocal}
        onPress={() => {
          setIsOnlinePaymentEnabledLocal((prevState: any) => !prevState);
          handleSetItems(
            !isOnlinePaymentEnabledLocal,
            "isOnlinePaymentEnabled"
          );
        }}
        containerStyle={styles.container}
        textStyle={styles.checkboxTitle}
        disabled={redistributionMethod === "Donate" && true}
      />

      <View style={{ marginHorizontal: 15 }}>
        <Input
          style={styles.placeholderStyle}
          labelStyle={styles.inputLabel}
          containerStyle={styles.inputContainer}
          label="Meeting and collection point (optional)"
          placeholder="Specify your meeting and collection point"
          multiline={true}
          onChangeText={(value) => setMeetingnColLocal(value)}
          onBlur={handleBlurMeeting}
          value={meetingnColLocal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    marginHorizontal: 15,
    marginTop: 10,
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
  checkboxTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#5A5A5A",
    backgroundColor: "#F8F9FB",
  },
});
