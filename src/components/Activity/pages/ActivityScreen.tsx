import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ActivityScreen_Acquirer from "../template/Activity_Acquirer";
import ActivityScreen_Lister from "../template/Activity_Lister";

const Tab = createMaterialTopTabNavigator();
export default function ActivityScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: "none",
        },
      }}
    >
      <Tab.Screen name="Acquirer" component={ActivityScreen_Acquirer} />
      <Tab.Screen name="Lister" component={ActivityScreen_Lister} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
