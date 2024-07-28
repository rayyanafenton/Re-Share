import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox } from "@rneui/themed";

import DatePicker from "../molecules/DatePicker";

export default function ListItemBidding({
  isBid,
  biddingDeadline,
  autoRelist,
  handleSetItems,
  redistributionMethod,
}: any) {
  const [biddingEnableLocal, setBiddingEnableLocal] = useState(isBid);
  const [biddingDeadlineLocal, setBiddingDeadlineLocal] =
    useState(biddingDeadline);
  const [autoRelistLocal, setAutoRelistLocal] = useState(autoRelist);
  const [showBidDeadline, setShowBidDeadline] = useState(false);

  useEffect(() => {
    if (
      isBid !== biddingEnableLocal ||
      biddingDeadline !== biddingDeadlineLocal ||
      autoRelist !== autoRelistLocal
    ) {
      setBiddingEnableLocal(isBid);
      setBiddingDeadlineLocal(biddingDeadline);
      setAutoRelistLocal(autoRelist);
      isBid === true ? setShowBidDeadline(true) : setBiddingDeadlineLocal(null);
    }
  }, [isBid, biddingDeadline, autoRelist]);

  return (
    <View style={styles.container}>
      <CheckBox
        title="Enable bidding"
        checked={biddingEnableLocal}
        onPress={() => {
          const newBiddingEnable = !biddingEnableLocal;
          setBiddingEnableLocal(newBiddingEnable);
          handleSetItems(newBiddingEnable, "isBid");
          setShowBidDeadline(!showBidDeadline);
          if (newBiddingEnable === false) {
            setBiddingDeadlineLocal("");
            setAutoRelistLocal(false);
            handleSetItems(false, "autoRelist");
          }
        }}
        containerStyle={styles.container}
        textStyle={styles.checkboxTitle}
        disabled={redistributionMethod === "Donate" && true}
      />

      {showBidDeadline ? (
        <>
          <View style={styles.sectionContainer}>
            <DatePicker
              biddingDeadlineLocal={biddingDeadlineLocal}
              onClick={(value: any) => {
                setBiddingDeadlineLocal(value);
                handleSetItems(value, "biddingDeadline");
              }}
            />
          </View>

          <CheckBox
            title="Auto Re-list"
            checked={autoRelistLocal}
            onPress={() => {
              setAutoRelistLocal(!autoRelistLocal);
              handleSetItems(!autoRelistLocal, "autoRelist");
            }}
            textStyle={{ fontWeight: "500" }}
            containerStyle={styles.container}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    color: "#5A5A5A",
    backgroundColor: "#F8F9FB",
  },
  sectionContainer: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  checkboxTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#5A5A5A",
    backgroundColor: "#F8F9FB",
  },
});
