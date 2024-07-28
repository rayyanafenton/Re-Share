import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

import { categoryLabel } from "../../../assets/categories";

export default function ListItemCategories({
  itemCategory,
  handleSetItems,
}: any) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(categoryLabel);
  const [itemCategoryLocal, setItemCategoryLocal] = useState(itemCategory);

  //dispatching the value to redux and local state
  const handleSetValue = (categoryValue: string) => {
    setItemCategoryLocal(categoryValue);
    handleSetItems(categoryValue, "itemCategory");
  };

  useEffect(() => {
    if (itemCategory !== itemCategoryLocal) {
      setItemCategoryLocal(itemCategory);
      console.log("category call");
    }
  }, [itemCategory]);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20, marginBottom: open ? 220 : 10 }}>
        <DropDownPicker
          open={open}
          items={items}
          setOpen={setOpen}
          value={itemCategoryLocal}
          setValue={setItemCategoryLocal}
          setItems={setItems}
          textStyle={styles.textCategory}
          listMode="SCROLLVIEW"
          placeholder={
            itemCategoryLocal ? itemCategoryLocal : "Select a category"
          }
          dropDownContainerStyle={styles.dropDownContainer}
          style={styles.borderStyle}
          onChangeValue={(categoryValue: any) => handleSetValue(categoryValue)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    marginHorizontal: 30,
    marginVertical: 10,
  },
  textCategory: {
    fontSize: 14,
  },
  dropDownContainer: {
    borderColor: "#748C94",
    elevation: 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  borderStyle: {
    borderColor: "#748C94",
  },
});
