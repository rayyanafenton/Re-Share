import { StyleSheet, View, Image, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";

export default function NewsnAnnouncement({ route }: any) {
  const adData = route.params;

  const timestamp = adData.time.toDate();

  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const formattedDate = timestamp.toLocaleDateString("en-GB", options);

  const descriptionLines = adData.description.split("\\n");

  return (
    <ScrollView
      bounces={false}
      bouncesZoom={false}
      showsVerticalScrollIndicator={false}
    >
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{ uri: adData.imageURL }}
      />
      <View style={styles.container}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.title}>{adData.title}</Text>

        <View style={{ marginBottom: 50 }}>
          {descriptionLines.map((line: any, index: any) => (
            <Text key={index} style={styles.description}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#F8F9FB",
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
  },
  date: {
    marginVertical: 20,
    fontSize: 12,
    color: "#5A5A5A",
  },
  description: {
    marginBottom: 10,
    marginTop: 2,
    fontSize: 14,
  },
});
