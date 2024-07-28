import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import getNewsAndAnnouncement from "../../../helper/news and announcement/getNewsAndAnnoucement";

export default function SlideAdd({ height, navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ads, setAds] = useState<any[]>([]);
  const [totalAds, setTotalAds] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const currentIndex = Math.floor(
      contentOffset.x / (layoutMeasurement.width - 50)
    );
    setCurrentIndex(currentIndex);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await getNewsAndAnnouncement();
        if (newsData && newsData.length) {
          setAds(newsData);
          setTotalAds(newsData.length + 1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const DotIndicator = () => {
    return (
      <View style={styles.containerIndicators}>
        {Array.from({ length: totalAds }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? "#007AFF" : "#C7C7CC",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TouchableOpacity onPress={() => navigation.navigate("How to Page")}>
          <View style={styles.containerCard}>
            <Image
              resizeMode="cover"
              style={[styles.image, { height: height }]}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/reshare-564f1.appspot.com/o/Flea.jpg?alt=media&token=abaf6c53-abd2-47e1-aadc-17f1d6973c8b",
              }}
            />
          </View>
        </TouchableOpacity>
        {ads.map((ad: any, index: any) => (
          <TouchableOpacity
            key={ad.id}
            onPress={() => navigation.navigate("News and Announcements", ad)}
          >
            <View style={styles.containerCard}>
              <Image
                resizeMode="cover"
                style={[styles.image, { height: height }]}
                source={{ uri: ad.imageURL }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <DotIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    width: Dimensions.get("window").width,
    paddingHorizontal: 15,
    paddingVertical: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    borderRadius: 15,
    borderWidth: 0.6,
    borderColor: "#DDDDDD",
  },
  containerIndicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
