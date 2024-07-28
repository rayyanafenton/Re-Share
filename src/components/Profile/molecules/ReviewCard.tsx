import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar, ListItem, AirbnbRating } from "@rneui/themed";

export default function ReviewCard({ review }: any) {
  return (
    <ListItem bottomDivider style={styles.container}>
      <Avatar
        rounded
        source={{ uri: review.ratingData.raterInfo.photoURL }}
        size={50}
      />
      <ListItem.Content>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginVertical: 1,
          }}
        >
          <AirbnbRating
            count={5}
            isDisabled
            defaultRating={review.ratingData.rating}
            size={14}
            showRating={false}
          />
          <ListItem.Subtitle style={{ marginTop: 5 }}>
            {review.ratingData.comment}
          </ListItem.Subtitle>
        </View>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
  },
});
