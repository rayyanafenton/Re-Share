import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Avatar, ListItem } from "@rneui/themed";
import { useSelector } from "react-redux";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

import getUserById from "../../../helper/user/getUserByID";
import getListingByID from "../../../helper/listing/getListingByID";

export default function MessageCard({
  message,
  page,
  renderRightActions,
}: any) {
  const [loading, setLoading] = useState(true);
  const [messageObject, setMessageObject] = useState(message);

  const user = useSelector<any, any>((state) => state.user.user);

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const lister = await getUserById(messageObject.listerID);
        const acquirer = await getUserById(messageObject.acquirerID);
        const listing = await getListingByID(messageObject.listingID);

        setMessageObject({
          ...messageObject,
          lister: lister,
          acquirer: acquirer,
          listing: listing,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [messageObject.id]);

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <ListItem
          bottomDivider
          onPress={page}
          containerStyle={styles.container}
        >
          <Avatar
            rounded
            source={{
              uri:
                user.photoURL === messageObject.acquirer?.photoURL
                  ? messageObject.lister?.photoURL
                  : messageObject.acquirer?.photoURL,
            }}
            size={50}
          />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              {user.id === messageObject.acquirer?.id
                ? messageObject.lister?.username
                : messageObject.acquirer?.username}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subTitle}>
              {messageObject.listing?.itemName}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 7,
  },
  subTitle: {
    fontSize: 14,
  },
});
