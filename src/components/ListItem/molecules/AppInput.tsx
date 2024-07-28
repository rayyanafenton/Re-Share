import { StyleSheet } from "react-native";
import React from "react";
import { Input } from "@rneui/themed";

export default function AppInput({
  label,
  placeholder,
  multiline,
  value,
}: any) {
  return (
    <Input
      style={styles.inputStyle}
      labelStyle={styles.inputLabel}
      label={label}
      placeholder={placeholder}
      multiline={multiline}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 14,
  },
  inputLabel: {
    color: "#1C1C1C",
    fontWeight: "700",
    marginBottom: 10,
  },
});
