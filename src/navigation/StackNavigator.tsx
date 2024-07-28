import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../components/Authentication and Authorization/pages/WelcomeScreen";
import LoginScreen from "../components/Authentication and Authorization/pages/LoginScreen";
import RegisterScreen from "../components/Authentication and Authorization/pages/RegisterScreen";
import AuthenticateScreen from "../components/Authentication and Authorization/pages/AuthenticateScreen";

import TabNavigator from "./TabNavigator";
import HowToPage from "../components/Home/pages/GettingStartedScreen";
import SearchScreen from "../components/Home/pages/SearchScreen";
import LikeScreen from "../components/Home/pages/LikeScreen";
import CategoryScreen from "../components/Home/pages/CategoryScreen";
import NotificationScreen from "../components/Home/pages/NotificationScreen";
import NewsnAnnouncement from "../components/Home/pages/NewsnAnnouncementScreen";
import ListingDetailsScreen_Acquirer from "../components/Activity/pages/ListingDetailsScreen_Acquirer";
import OtherProfileScreen from "../components/Profile/pages/OtherProfileScreen";
import PaymentScreen from "../components/Activity/pages/PaymentScreen";
import OnlinePaymentScreen from "../components/Activity/pages/OnlinePaymentScreen";
import TransactionDetailsScreen_Acquirer from "../components/Activity/pages/TransactionDetailsScreen_Acquirer";
import ListingDetailsScreen_Lister from "../components/Activity/pages/ListingDetailsScreen_Lister";
import ListItemEditScreen from "../components/ListItem/pages/ListItemEditScreen";
import TransactionDetailsScreen_Lister from "../components/Activity/pages/TransactionDetailsScreen_Lister";
import MessageDetailsScreen from "../components/Message/pages/MessageDetailsScreen";
import EditProfileScreen from "../components/Profile/pages/EditProfileScreen";
import SettingScreen from "../components/Profile/pages/SettingScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Authenticate" component={AuthenticateScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Group>

      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen name="Like" component={LikeScreen} />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen
          name="News and Announcements"
          component={NewsnAnnouncement}
          options={{
            headerTitle: "News and Annoucement",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="How to Page"
          component={HowToPage}
          options={{
            headerTitle: "Guidelines and Policies",
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="Listing Details Acquirer"
          component={ListingDetailsScreen_Acquirer}
          options={{
            headerTitle: "Item Details",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Listing Details Lister"
          component={ListingDetailsScreen_Lister}
          options={{
            headerTitle: "Item Details",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Transaction Details Acquirer"
          component={TransactionDetailsScreen_Acquirer}
          options={{
            headerTitle: "Transaction Details",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Transaction Details Lister"
          component={TransactionDetailsScreen_Lister}
          options={{
            headerTitle: "Transaction Details",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            headerTitle: "Make Payment",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Online Payment"
          component={OnlinePaymentScreen}
          options={({ route }: any) => ({
            headerTitle: route.params?.onlinePaymentMethod,
            headerBackTitleVisible: false,
          })}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="List Item Lister"
          component={ListItemEditScreen}
          options={{
            headerTitle: "Edit Listing",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="Message Details"
          component={MessageDetailsScreen}
          options={{
            headerTitle: "Message",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="Other User Profile"
          component={OtherProfileScreen}
          options={{
            headerTitle: "User Profile",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Edit Profile"
          component={EditProfileScreen}
          options={{
            headerBackTitleVisible: false,
          }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
