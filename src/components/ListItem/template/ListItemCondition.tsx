import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Input } from "@rneui/themed";
import DropDownPicker from "react-native-dropdown-picker";

import conditionOption from "../../../assets/conditions";

export default function ListItemConditionScreen({
  itemCondition,
  itemConditionNote,
  handleSetItems,
}: any) {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState(conditionOption);

  const [itemConditionLocal, setItemConditionLocal] = useState(itemCondition);
  const [itemConditionNoteLocal, setItemConditionNoteLocal] =
    useState(itemConditionNote);

  const handleBlurNote = () => {
    if (itemConditionNoteLocal !== itemConditionNote) {
      handleSetItems(`${itemConditionNoteLocal}`, "itemConditionNote");
    }
  };

  useEffect(() => {
    if (
      itemCondition !== itemConditionLocal ||
      itemConditionNote !== itemConditionNoteLocal
    ) {
      setItemConditionLocal(itemCondition);
      setItemConditionNoteLocal(itemConditionNote);
    }
  }, [itemCondition, itemConditionNote]);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: open ? 220 : 30 }}>
        <DropDownPicker
          open={open}
          value={itemConditionLocal}
          items={conditions}
          setOpen={setOpen}
          setValue={setItemConditionLocal}
          setItems={setConditions}
          textStyle={styles.textCategory}
          listMode="SCROLLVIEW"
          placeholder="Select a condition"
          dropDownContainerStyle={styles.dropDownContainer}
          style={styles.border}
          onChangeValue={(text: any) => {
            handleSetItems(`${text}`, "itemCondition");
          }}
        />
      </View>

      <Input
        style={styles.placeholderStyle}
        labelStyle={styles.inputLabel}
        containerStyle={styles.inputContainer}
        label="Notes on condition (optional)"
        placeholder="Describe more about the condition..."
        multiline={true}
        onChangeText={(text) => {
          setItemConditionNoteLocal(text);
        }}
        onBlur={handleBlurNote}
        value={itemConditionNoteLocal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    marginHorizontal: 30,
    marginTop: 20,
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
  border: {
    borderColor: "#748C94",
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
