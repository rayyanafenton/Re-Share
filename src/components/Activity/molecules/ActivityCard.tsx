import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Card } from "@rneui/base";

import { getTimeRemaining } from "../../../utils/getTimeRemaining";
import getOffers from "../../../helper/offer/getOffers";
import closeBidding from "../../../helper/bidding/closeBidding";

export default function ActivityCard({ activity, page }: any) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [loading, setLoading] = useState(true);
  const [offersData, setOffersData] = useState({
    totalOffers: 0,
    highestOfferPrice: 0,
  });
  const maxItemNameLength = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOffers(activity.listingID);
        setOffersData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching offers data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let intervalId: any;

    if (activity.listingData && activity.listingData.biddingDeadline) {
      const timeRemainingStr = getTimeRemaining(
        activity.listingData.biddingDeadline
      );

      if (timeRemainingStr === "Bidding Ended") {
        clearInterval(intervalId);
        setTimeRemaining(timeRemainingStr);
        setLoading(true);
        closeBidding(offersData, activity.listingData);
        setLoading(false);
      } else {
        intervalId = setInterval(() => {
          const timeRemainingStr = getTimeRemaining(
            activity.listingData.biddingDeadline
          );

          if (timeRemainingStr === "Bidding Ended") {
            clearInterval(intervalId);
            setTimeRemaining(timeRemainingStr);
            setLoading(true);
            closeBidding(offersData, activity.listingData);
            setLoading(false);
          }

          setTimeRemaining(timeRemainingStr);
        }, 1000);
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [activity.listingData, offersData]);

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={page}>
      <Card
        wrapperStyle={styles.wrapperStyle}
        containerStyle={styles.containerStyle}
      >
        {!loading ? (
          <>
            <Image
              source={{
                uri:
                  activity.listingData?.imageUris?.[0] ||
                  "https://media.istockphoto.com/id/1392182937/vector/no-image-available-photo-coming-soon.jpg?s=612x612&w=0&k=20&c=3vGh4yj0O2b4tPtjpK-q-Qg0wGHsjseL2HT-pIyJiuc=",
              }}
              style={styles.image}
              resizeMode="cover"
            />

            <Text style={styles.itemRedistribution}>
              {activity.listingData?.itemRedistributionMethod}
            </Text>

            <View style={styles.detailsContainer}>
              <Text style={styles.name}>
                {activity.listingData?.itemName.length > maxItemNameLength
                  ? `${activity.listingData.itemName.substring(
                      0,
                      maxItemNameLength
                    )}...`
                  : activity.listingData.itemName}
              </Text>

              {activity.listingData?.itemRedistributionMethod === "Rent" ? (
                <Text style={styles.price}>
                  RM {activity.listingData?.itemPrice}/day
                </Text>
              ) : activity.listingData?.itemRedistributionMethod ===
                "Donate" ? (
                <Text style={styles.price}>For free</Text>
              ) : (
                <Text style={styles.price}>
                  RM {activity.listingData?.itemPrice}
                </Text>
              )}

              {activity.status ? (
                <Text style={styles.status}>{activity.status}</Text>
              ) : (
                <Text style={styles.status}>Pending</Text>
              )}
            </View>

            {activity.activity === "offer" ? (
              <View style={styles.bidDetailsContainer}>
                <Text style={styles.bidText}>
                  {offersData.totalOffers} Bids
                </Text>
                <Text style={styles.bidTextTime}>{timeRemaining}</Text>
              </View>
            ) : (
              ""
            )}
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#BBBBBB" />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  containerStyle: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0.7,
    elevation: 0.7,
  },
  detailsContainer: {
    flexDirection: "column",
    position: "absolute",
    top: "auto",
    left: 100,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  price: {
    marginVertical: 5,
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    color: "#748C94",
    marginTop: 5,
  },
  bidDetailsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  bidText: {
    fontSize: 14,
    marginVertical: 5,
  },
  bidTextTime: {
    fontSize: 14,
    marginVertical: 5,
    color: "#0077E6",
  },
  itemRedistribution: {
    fontSize: 10,
    backgroundColor: "#0077E6",
    color: "#FFFFFF",
    paddingHorizontal: 5,
    marginTop: 5,
    position: "absolute",
    top: 1.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
