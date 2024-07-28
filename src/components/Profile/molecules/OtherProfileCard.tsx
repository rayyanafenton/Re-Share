import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { AirbnbRating, Avatar, ListItem } from "@rneui/themed";

export default function UserProfile({ user, rating }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Avatar rounded source={{ uri: user.photoURL }} size={70} />
        <ListItem.Content style={styles.content}>
          <ListItem.Title style={styles.name}>{user.username}</ListItem.Title>

          <ListItem.Subtitle style={styles.email}>
            {user.email}
          </ListItem.Subtitle>

          <AirbnbRating
            count={5}
            isDisabled
            reviewSize={0}
            defaultRating={rating}
            size={14}
            starContainerStyle={styles.rating}
            reviews={[]}
          />
        </ListItem.Content>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#075985",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 25,
    paddingVertical: 30,
  },
  content: {
    marginLeft: 15,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  email: {
    color: "#fff",
    fontWeight: "200",
    marginTop: 5,
  },
  rating: {
    position: "absolute",
    top: 10,
    left: -1,
  },
});
