import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Input } from "@rneui/themed";

export default function ListItemDetails({
  itemName,
  itemDescription,
  handleSetItems,
}: any) {
  const [itemNameLocal, setItemNameLocal] = useState(itemName);
  const [itemDescriptionLocal, setItemDescriptionLocal] =
    useState(itemDescription);

  const handleBlurName = () => {
    if (itemNameLocal !== itemName) {
      handleSetItems(itemNameLocal, "itemName");
    }
  };

  const handleBlurDescription = () => {
    if (itemDescriptionLocal !== itemDescription) {
      handleSetItems(itemDescriptionLocal, "itemDescription");
    }
  };

  useEffect(() => {
    if (
      itemName !== itemNameLocal ||
      itemDescription !== itemDescriptionLocal
    ) {
      setItemNameLocal(itemName);
      setItemDescriptionLocal(itemDescription);
    }
  }, [itemName, itemDescription]);

  return (
    <View style={styles.container}>
      <Input
        style={styles.placeholderStyle}
        labelStyle={styles.inputLabel}
        containerStyle={styles.inputContainer}
        label="Item Name"
        placeholder="Name your listing"
        multiline={true}
        onChangeText={(value) => setItemNameLocal(value)}
        onBlur={handleBlurName}
        value={itemNameLocal}
      />
      <Input
        style={styles.placeholderStyle}
        labelStyle={styles.inputLabel}
        containerStyle={styles.inputContainer}
        label="Item Description (optional)"
        placeholder="Describe your item..."
        multiline={true}
        onChangeText={(value) => setItemDescriptionLocal(value)}
        onBlur={handleBlurDescription}
        value={itemDescriptionLocal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    marginHorizontal: 30,
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
});
