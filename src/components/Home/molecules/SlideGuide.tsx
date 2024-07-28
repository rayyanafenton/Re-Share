import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";

export default function SlideGuide({ guideImages }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalAds = guideImages.length;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const currentIndex = Math.floor(
      contentOffset.x / (layoutMeasurement.width - 50)
    );
    setCurrentIndex(currentIndex);
  };

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

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {guideImages.map((ad: any, index: any) => (
          <View key={index} style={styles.containerCard}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={ad.imagePath}
            />
          </View>
        ))}
      </ScrollView>
      <DotIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    width: Dimensions.get("window").width,
    paddingVertical: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 400,
  },
  containerIndicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
