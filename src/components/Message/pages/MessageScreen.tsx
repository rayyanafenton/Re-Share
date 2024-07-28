import { StyleSheet } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import MessageScreen_Acquirer from "../template/Message_Acquirer";
import MessageScreen_Lister from "../template/Message_Lister";

const Tab = createMaterialTopTabNavigator();

export default function MessageScreen() {
  return (
    <Tab.Navigator
      swipeEnabled={false}
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: "none",
        },
      }}
    >
      <Tab.Screen name="Acquirer" component={MessageScreen_Acquirer} />
      <Tab.Screen name="Lister" component={MessageScreen_Lister} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
