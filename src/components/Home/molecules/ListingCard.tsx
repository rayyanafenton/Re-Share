import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Text, Card, Icon, Image } from "@rneui/themed";
import { useSelector } from "react-redux";

import { getTimeRemaining } from "../../../utils/getTimeRemaining";
import getOffers from "../../../helper/offer/getOffers";
import addLike from "../../../helper/like/createLike";
import deleteLike from "../../../helper/like/deleteLike";
import isLikeExist from "../../../helper/like/isLikeExist";
import closeBidding from "../../../helper/bidding/closeBidding";

export default function ListingCard({ listing, page, lister }: any) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [loading, setLoading] = useState(true);
  const [offersData, setOffersData] = useState({
    totalOffers: 0,
    highestOfferPrice: 0,
    acquirerID: "",
  });

  const [iconColor, setIconColor] = useState("#585858");
  const [liked, setLiked] = useState(false);
  const user = useSelector<any, any>((state) => state.user.user);
  const maxItemNameLength = 20;

  const handleLikePressed = async () => {
    if (liked) {
      await deleteLike(listing.id, user.id);
      setLiked(false);
      setIconColor("#585858");
    } else {
      await addLike(listing.id, user.id);
      setLiked(true);
      setIconColor("#FF190C");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOffers(listing.id);
        setOffersData(data);

        const like = await isLikeExist(listing.id, user.id);
        setLiked(like);
        like ? setIconColor("#FF190C") : setIconColor("#585858");

        setLoading(false);
      } catch (error) {
        console.error("Error fetching offers data:", error);
      }
    };
    fetchData();
  }, [listing]);

  useEffect(() => {
    let intervalId: any;

    if (listing.biddingDeadline) {
      const timeRemainingStr = getTimeRemaining(listing.biddingDeadline);

      if (timeRemainingStr === "Bidding Ended") {
        clearInterval(intervalId);
        setTimeRemaining(timeRemainingStr);
        setLoading(true);
        closeBidding(offersData, listing);
        setLoading(false);
      } else {
        intervalId = setInterval(() => {
          const timeRemainingStr = getTimeRemaining(listing.biddingDeadline);

          setTimeRemaining(timeRemainingStr);
        }, 1000);
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [listing.biddingDeadline, offersData]);

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth / 2;
  return (
    <Card
      wrapperStyle={styles.wrapperStyle}
      containerStyle={[
        styles.containerStyle,
        { maxWidth: cardWidth - 20, minWidth: cardWidth - 20 },
      ]}
    >
      {!loading ? (
        <TouchableOpacity activeOpacity={0.8} onPress={page}>
          <View style={styles.likeContainer}>
            {!lister && (
              <Icon
                name="favorite"
                type="material"
                color={iconColor}
                size={25}
                onPress={handleLikePressed}
              />
            )}
          </View>

          <Image
            resizeMode="cover"
            style={[styles.cardImage, { height: cardWidth / 1.4 }]}
            source={{ uri: listing.imageUris[0] }}
          />

          <Text style={styles.itemRedistribution}>
            {listing.itemRedistributionMethod}
          </Text>

          <Text style={styles.itemName}>
            {listing.itemName.length > maxItemNameLength
              ? `${listing.itemName.substring(0, maxItemNameLength)}...`
              : listing.itemName}
          </Text>
          {listing.itemRedistributionMethod == "Rent" ? (
            <Text style={styles.itemHorizontal}>
              RM {listing.itemPrice}/day
            </Text>
          ) : listing.itemRedistributionMethod == "Donate" ? (
            <Text style={styles.itemHorizontal}>For free</Text>
          ) : (
            <Text style={styles.itemHorizontal}>RM {listing.itemPrice}</Text>
          )}

          <View style={styles.horizontalContainer}>
            {listing.isBid == false ? (
              <Text style={styles.itemBidding}>{listing.itemCategory}</Text>
            ) : (
              <>
                <Text style={styles.itemBidding}>
                  {offersData.totalOffers} Bids
                </Text>
                <Text style={styles.itemHorizontalSmaller}>
                  {timeRemaining === "Bidding Ended" ? (
                    <Text style={[styles.text, { color: "#ff190c" }]}>
                      {timeRemaining}
                    </Text>
                  ) : (
                    <Text
                      style={[styles.text, { color: "#0077E6" }]}
                    >{`${timeRemaining}`}</Text>
                  )}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#BBBBBB" />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  wrapperStyle: {
    margin: -5,
  },
  text: {
    marginVertical: 3,
    color: "#5A5A5A",
  },
  containerStyle: {
    borderRadius: 15,
    shadowOpacity: 0.7,
    elevation: 0.7,
    marginHorizontal: 5,
    marginBottom: 5,
    backgroundColor: "#FFFFFF",
  },
  likeContainer: {
    position: "absolute",
    zIndex: 8,
    top: -2,
    right: -2,
    width: 35,
    height: 35,
    background: "#FFFFFF",
    justifyContent: "center",
    borderRadius: 20,
  },
  cardImage: {
    borderRadius: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    marginLeft: 3,
  },
  itemHorizontal: {
    fontSize: 14,
    marginTop: 3,
    marginLeft: 3,
  },
  itemRedistribution: {
    fontSize: 12,
    backgroundColor: "#0077E6",
    color: "#FFFFFF",
    paddingHorizontal: 5,
    marginTop: 6,
    position: "absolute",
    top: 1,
  },
  itemHorizontalSmaller: {
    fontSize: 12,
    paddingTop: 5,
    color: "#748C94",
  },
  itemBidding: {
    fontSize: 12,
    paddingTop: 5,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 5,
    marginHorizontal: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
