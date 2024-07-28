import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button } from "@rneui/themed";
import { NavigationProp, CommonActions } from "@react-navigation/native"; // Corrected import

import { FIREBASE_AUTH } from "../../../firebase/Firebaseconfig";
import { clearUser } from "../../../redux/userActions";

const SettingScreen = ({ navigation }: any) => {
  const auth = FIREBASE_AUTH;
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      navigation.navigate("Welcome");
      dispatch(clearUser());
    } catch (error) {
      console.log(error);
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
    <>
      <ScrollView style={styles.scrollContainer}>
        <Button buttonStyle={styles.button} onPress={logout}>
          Log Out
        </Button>
      </ScrollView>
    </>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
  scrollContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingVertical: 20,
  },
  button: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
});
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
