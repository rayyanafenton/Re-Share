import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import UserProfile from "../molecules/OtherProfileCard";
import ProfileScreen_Like from "../template/Profile_Like";
import ProfileScreen_Listing from "../template/Profile_Listing";
import ProfileScreen_Review from "../template/Profile_Reviews";

import getUserRatingAndComment from "../../../helper/rating and comment/getUserRatingAndComment";

const Tab = createMaterialTopTabNavigator();

const OtherUserProfileScreen = ({ route }: any) => {
  const user = route.params.userInfo;
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserRatingAndComment(user.id);
        const ratings = userData.map((rating: any) => rating.ratingData.rating);
        const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
        const average = ratings.length > 0 ? totalRating / ratings.length : 0;

        setAverageRating(average);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving data acq:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <UserProfile user={user} rating={averageRating} />
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
          initialParams={{ passUser: user.id }}
        />
        <Tab.Screen
          name="Likes"
          component={ProfileScreen_Like}
          initialParams={{ passUser: user.id }}
        />
        <Tab.Screen
          name="Reviews"
          component={ProfileScreen_Review}
          initialParams={{ passUser: user.id }}
        />
      </Tab.Navigator>
    </>
  );
};

export default OtherUserProfileScreen;

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
