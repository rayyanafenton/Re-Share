import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import getNotificationList from "../../../helper/notification/getNotificationList";

import NotificationList from "../organisms/NotificationList";

export default function NotificationScreen() {
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector<any, any>((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(user.id);
        const notificationData = await getNotificationList(user.id);
        notificationData ? setNotificationList(notificationData) : "";
        setLoading(false);
        console.log(notificationData);
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
      <NotificationList list={notificationList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
