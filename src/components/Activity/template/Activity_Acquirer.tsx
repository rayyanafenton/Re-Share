import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import getActivitiesAcquirer from "../../../helper/activity/getActivitiesAcquirer";
import getActivitiesAcquirerByStatus from "../../../helper/activity/getActivitiesAcquirerByStatus";

import ActivityCardList from "../organisms/ActivityCardList";
import TagListItem from "../../Home/organisms/TagList";

export default function ActivityScreen_Acquirer({ navigation }: any) {
  const [activityList, setActivityList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector<any, any>((state) => state.user.user);

  const tagOptions = ["All", "Pending", "Ongoing", "Completed", "Unsuccessful"];
  const [selectedTag, setSelectedTag] = useState("All");

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const activityData = await getActivitiesAcquirer(user.id);
          activityData && setActivityList(activityData);
          setLoading(false);
        } catch (error) {
          console.error("Error retrieving data acq:", error);
          setLoading(false);
        }
      };
      fetchData();
    }, [user.id])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let activityData: any[] | null;
        if (selectedTag === "All") {
          activityData = await getActivitiesAcquirer(user.id);
        } else {
          const activityData = await getActivitiesAcquirerByStatus(
            user.id,
            selectedTag
          );
          activityData && setActivityList(activityData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving data list:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTag]);

  const changeSelectedTag = (text: any) => {
    setSelectedTag(text);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
      bouncesZoom={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <TagListItem
        tagOptions={tagOptions}
        navigation={navigation}
        changeSelectedTag={changeSelectedTag}
        selectedTag={selectedTag}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ActivityCardList navigation={navigation} activities={activityList} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
});
