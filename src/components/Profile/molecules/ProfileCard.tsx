import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar, Icon, ListItem } from "@rneui/themed";
import { useSelector } from "react-redux";

import WhiteButton from "./WhiteButton";

export default function Profile({ edit, setting }: any) {
  const user = useSelector((state: any) => state.user.user);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Avatar rounded source={{ uri: user.photoURL }} size={"large"} />

          <ListItem.Content style={styles.content}>
            <ListItem.Title style={styles.name}>{user.username}</ListItem.Title>
            <ListItem.Subtitle style={styles.email}>
              {user.email}
            </ListItem.Subtitle>
          </ListItem.Content>

          <Icon
            type="material"
            name="settings"
            size={30}
            color="#fff"
            onPress={setting}
          />
        </View>

        <WhiteButton text="Edit Profile" onPress={edit} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#075985",
    justifyContent: "flex-end",
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  userContainer: {
    flexDirection: "row",
    marginBottom: 30,
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
  },
});
