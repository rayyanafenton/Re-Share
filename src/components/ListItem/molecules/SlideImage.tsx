import {
  StyleSheet,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import React, { useState } from "react";

export default function SlideImage({ images }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const currentIndex = Math.floor(
      contentOffset.x / (layoutMeasurement.width - 50)
    );
    setCurrentIndex(currentIndex);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image: ImageSourcePropType, index: number) => (
          <View key={index} style={styles.containerCard}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={{ uri: image as string }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    width: Dimensions.get("window").width,
  },
  image: {
    width: "100%",
    height: 250,
  },
  containerIndicators: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
