import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Icon } from "@rneui/themed";

const AppSearchBar = ({
  searchPhrase,
  setSearchPhrase,
  handleGetListing,
}: any) => {
  return (
    <View style={styles.searchContainer}>
      <TouchableWithoutFeedback
        onPress={() => {
          setSearchPhrase("");
        }}
      >
        <View style={styles.searchBar}>
          <Icon type="material" name="search" />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor={"#BBBBBB"}
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            onSubmitEditing={handleGetListing}
            returnKeyType="search"
            onBlur={() => {
              Keyboard.dismiss();
            }}
          />
          {searchPhrase && (
            <Icon
              type="material"
              name="close"
              onPress={() => {
                setSearchPhrase("");
              }}
              size={20}
              color="black"
              style={{ marginRight: 2 }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AppSearchBar;

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    paddingHorizontal: 10,
    flexDirection: "row",
    width: "95%",
    height: 45,
    borderRadius: 15,
    alignItems: "center",
    borderColor: "#748C94",
    borderWidth: 1,
  },
});
