import { FlatList, StyleSheet, View } from "react-native";
import React, { useState } from "react";

import deleteNotification from "../../../helper/notification/deleteNotification";

import NotificationCard from "../molecules/NotificationCard";
import DeleteItem from "../molecules/DeleteItemButton";

export default function NotificationList({ list }: any) {
  const [notificationList, setNotificationList] = useState(list);

  const handleDelete = async (list: any) => {
    await deleteNotification(list.id);
    setNotificationList(notificationList.filter((m: any) => m.id !== list.id));
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={notificationList}
          keyExtractor={(notification) => notification.id}
          renderItem={({ item }) => (
            <NotificationCard
              list={item}
              renderRightActions={() => (
                <DeleteItem onPress={() => handleDelete(item)}></DeleteItem>
              )}
            />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
