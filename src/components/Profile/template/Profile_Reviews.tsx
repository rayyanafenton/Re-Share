import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import getUserRatingAndComment from "../../../helper/rating and comment/getUserRatingAndComment";

import ReviewCardList from "../organisms/ReviewCardList";

export default function ProfileScreen_Review({ navigation, route }: any) {
  const [reviewList, setReviewList] = useState<any | null[]>([null]);
  const [loading, setLoading] = useState(true);
  const user = useSelector<any, any>((state) => state.user.user);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      try {
        let userRatingList;
        if (route.params && route.params.passUser) {
          userRatingList = await getUserRatingAndComment(route.params.passUser);
        } else {
          userRatingList = await getUserRatingAndComment(user.id);
        }

        if (userRatingList !== null) setReviewList(userRatingList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rating and comment:", error);
        setLoading(false);
      }
    };

    fetchDataAndLog();
  }, [user.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ReviewCardList items={reviewList} navigation={navigation} />
    </View>
  );
}

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
  button: {
    padding: 10,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});
