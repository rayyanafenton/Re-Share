import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox, Input } from "@rneui/themed";

export default function ListItemRedistribution({
  itemRedistributionMethod,
  itemPrice,
  itemRentingMinDays,
  itemRentingMaxDays,
  itemDeposit,
  handleSetItems,
}: any) {
  const [showSection, setShowSection] = useState(itemRedistributionMethod);

  const [itemRedistributionMethodLocal, setItemRedistributionMethodLocal] =
    useState(itemRedistributionMethod);

  const [itemPriceLocal, setItemPriceLocal] = useState(itemPrice);

  const [itemRentingMinDaysLocal, setItemRentingMinDaysLocal] =
    useState(itemRentingMinDays);

  const [itemRentingMaxDaysLocal, setItemRentingMaxDaysLocal] =
    useState(itemRentingMaxDays);

  const [itemDepositLocal, setItemDepositLocal] = useState(itemDeposit);

  useEffect(() => {
    if (showSection !== itemRedistributionMethodLocal) {
      setShowSection(itemRedistributionMethodLocal);
      handleSetItems(itemRedistributionMethodLocal, "itemRedistributionMethod");
      if (itemRedistributionMethodLocal === "Donate")
        handleSetItems("0", "itemPrice");
      else handleSetItems("", "itemPrice");

      handleSetItems("", "itemRentingMinDays");
      handleSetItems("", "itemRentingMaxDays");
      handleSetItems("", "itemDeposit");
    }
  }, [itemRedistributionMethodLocal, showSection]);

  useEffect(() => {
    if (
      itemRedistributionMethod !== itemRedistributionMethodLocal ||
      itemPrice !== itemPriceLocal ||
      itemRentingMaxDays !== itemRentingMaxDaysLocal ||
      itemRentingMinDays !== itemRentingMinDaysLocal ||
      itemDeposit !== itemDepositLocal
    ) {
      setItemRedistributionMethodLocal(itemRedistributionMethod);
      setShowSection(itemRedistributionMethod);
      setItemPriceLocal(itemPrice);
      setItemRentingMaxDaysLocal(itemRentingMaxDays);
      setItemRentingMinDaysLocal(itemRentingMinDays);
      setItemDepositLocal(itemDeposit);
    }
  }, [
    itemRedistributionMethod,
    itemPrice,
    itemRentingMaxDays,
    itemRentingMinDays,
    itemDeposit,
  ]);

  const handleBlurPrice = () => {
    if (itemPrice !== itemPriceLocal) {
      handleSetItems(itemPriceLocal, "itemPrice");
    }
  };
  const handleBlurMinDays = () => {
    if (itemRentingMinDays !== itemRentingMinDaysLocal) {
      handleSetItems(itemRentingMinDaysLocal, "itemRentingMinDays");
    }
  };
  const handleBlurMaxDays = () => {
    if (itemRentingMaxDays !== itemRentingMaxDaysLocal) {
      handleSetItems(itemRentingMaxDaysLocal, "itemRentingMaxDays");
    }
  };
  const handleBlurDeposit = () => {
    if (itemDeposit !== itemDepositLocal) {
      handleSetItems(itemDepositLocal, "itemDeposit");
    }
  };

  const renderSection = (section: string, label: string) => {
    return (
      <>
        <View style={styles.sectionContainer}>
          <Input
            style={styles.placeholderStyle}
            labelStyle={styles.inputLabel}
            label={label}
            placeholder={`RM ${section === "Rent" ? " /Day" : ""}`}
            keyboardType="numeric"
            onChangeText={(value) => setItemPriceLocal(value)}
            onBlur={handleBlurPrice}
            value={`${itemPriceLocal}`}
          />
          {section === "Rent" && (
            <>
              <Input
                style={styles.placeholderStyle}
                labelStyle={styles.inputLabel}
                label="Min. Booking Days (Optional)"
                placeholder="Enter number of days"
                keyboardType="numeric"
                onChangeText={(value) => setItemRentingMinDaysLocal(value)}
                onBlur={handleBlurMinDays}
                value={`${itemRentingMinDaysLocal}`}
              />
              <Input
                style={styles.placeholderStyle}
                labelStyle={styles.inputLabel}
                label="Max. Booking Days (Optional)"
                placeholder="Enter number of days"
                keyboardType="numeric"
                onChangeText={(value) => setItemRentingMaxDaysLocal(value)}
                onBlur={handleBlurMaxDays}
                value={`${itemRentingMaxDaysLocal}`}
              />
              <Input
                style={styles.placeholderStyle}
                labelStyle={styles.inputLabel}
                label="Item Deposit (Optional)"
                placeholder="RM"
                keyboardType="numeric"
                onChangeText={(value) => setItemDepositLocal(value)}
                onBlur={handleBlurDeposit}
                value={`${itemDepositLocal}`}
              />
            </>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <CheckBox
        title="For Sale"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={itemRedistributionMethodLocal === "Sell"}
        onPress={() => {
          setItemRedistributionMethodLocal("Sell");
        }}
        textStyle={styles.checkboxTitle}
        containerStyle={styles.checkboxContainer}
      />
      {showSection === "Sell" && renderSection("Sell", "Selling Price")}

      <CheckBox
        title="For Rent"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={itemRedistributionMethodLocal === "Rent"}
        onPress={() => {
          setItemRedistributionMethodLocal("Rent");
        }}
        textStyle={styles.checkboxTitle}
        containerStyle={styles.checkboxContainer}
      />
      {showSection === "Rent" &&
        renderSection("Rent", "Renting Price (per Day)")}

      <CheckBox
        title="For Free"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={itemRedistributionMethodLocal === "Donate"}
        onPress={() => {
          setItemRedistributionMethodLocal("Donate");
        }}
        textStyle={styles.checkboxTitle}
        containerStyle={styles.checkboxContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  sectionContainer: {
    marginTop: 10,
    marginLeft: 30,
  },
  checkboxContainer: {
    backgroundColor: "#F8F9FB",
  },
  checkboxTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#5A5A5A",
    backgroundColor: "#F8F9FB",
  },
  list: {
    flexDirection: "column",
  },
  inputLabel: {
    fontWeight: "500",
    fontSize: 14,
    color: "#5A5A5A",
  },
  placeholderStyle: {
    fontSize: 14,
  },
});
