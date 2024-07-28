import { StyleSheet } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Profile from "../molecules/ProfileCard";
import ProfileScreen_Like from "../template/Profile_Like";
import ProfileScreen_Listing from "../template/Profile_Listing";
import ProfileScreen_Review from "../template/Profile_Reviews";

const Tab = createMaterialTopTabNavigator();

const UserProfileScreen = ({ navigation }: any) => {
  function goToEditProfile() {
    navigation.navigate("Edit Profile");
  }

  function goToSetting() {
    navigation.navigate("Settings");
  }

  return (
    <>
      <Profile edit={goToEditProfile} setting={goToSetting} />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            textTransform: "none",
          },
        }}
      >
        <Tab.Screen
          name="Listings"
          component={ProfileScreen_Listing}
          initialParams={{ lister: true }}
        />
        <Tab.Screen
          name="Likes"
          component={ProfileScreen_Like}
          initialParams={{ lister: true }}
        />
        <Tab.Screen name="Reviews" component={ProfileScreen_Review} />
      </Tab.Navigator>
    </>
  );
};

export default UserProfileScreen;

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
});
