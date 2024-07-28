import { Platform, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Icon } from "@rneui/themed";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "../components/Profile/pages/UserProfileScreen";
import MessageScreen from "../components/Message/pages/MessageScreen";
import ListItemScreen from "../components/ListItem/pages/ListItemScreen";
import ActivityScreen from "../components/Activity/pages/ActivityScreen";
import HomeScreen from "../components/Home/pages/HomeScreen";
import { TouchableOpacity } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function Home({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Icon
              type="material"
              name="search"
              onPress={() => navigation.navigate("Search")}
            />
          ),
          headerRight: () => (
            <>
              <Icon
                type="material"
                name="notifications"
                onPress={() => navigation.navigate("Notification")}
                style={{ marginRight: 20 }}
              />
              <Icon
                type="material"
                name="favorite-border"
                onPress={() => navigation.navigate("Like")}
              />
            </>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export function Activity({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Item Status"
        component={ActivityScreen}
        options={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export function ListItem({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List Item"
        component={ListItemScreen}
        options={{
          headerTitle: "List Item",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

export function Message({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{
          headerTitle: "Messages",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export function Profile({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#fff",
          },
          headerStyle: {
            backgroundColor: "#075985",
          },
        }}
      />
    </Stack.Navigator>
  );
}

const CircleIcon = ({ focused }: any) => {
  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: focused ? "#075985" : "#0077E6",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon type="material" name="add" size={30} color="#FFFFFF" />
    </View>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 55,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home Tab"
        component={Home}
        options={({ route }) => ({
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material"
              name="home"
              size={28}
              color={focused ? "#075985" : "#748c94"}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Activity Tab"
        component={Activity}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material"
              name="shopping-bag"
              size={28}
              color={focused ? "#075985" : "#748c94"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="List Item Tab"
        component={ListItem}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => <CircleIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Messages Tab"
        component={Message}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material"
              name="message"
              size={28}
              color={focused ? "#075985" : "#748c94"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile Tab"
        component={Profile}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material"
              name="account-circle"
              size={28}
              color={focused ? "#075985" : "#748c94"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
