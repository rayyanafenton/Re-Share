import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";

import getMessagesAcquirer from "../../../helper/message/getMessagesAcquirer";

import MessageCardList from "../organisms/MessageCardList";

export default function MessageScreen_Acquirer({ navigation }: any) {
  const [messageList, setMessageList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector<any, any>((state) => state.user.user);

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const activityData = await getMessagesAcquirer(user.id);
        setMessageList(activityData);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MessageCardList navigation={navigation} messages={messageList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
