import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, ListItem } from "@rneui/themed";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import getFormattedDate from "../../../utils/getFormattedDate";

export default function NotificationCard({ list, renderRightActions }: any) {
  const [formattedDateDeadline, setFormattedDateDeadline] = useState("");

  useEffect(() => {
    setFormattedDateDeadline(getFormattedDate(list.time));
  }, []);

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <ListItem bottomDivider style={styles.container}>
          <Avatar
            rounded
            source={{ uri: list.imageURL ? list.imageURL : "" }}
            size={50}
          />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>{list.title}</ListItem.Title>
            <ListItem.Subtitle style={styles.subTitle}>
              {list.message}
            </ListItem.Subtitle>
            <Text style={styles.date}>{formattedDateDeadline}</Text>
          </ListItem.Content>
        </ListItem>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 7,
  },
  subTitle: {
    fontSize: 14,
  },
  date: {
    position: "absolute",
    right: 0,
    top: -10,
    fontSize: 10,
    color: "#707070",
  },
});
