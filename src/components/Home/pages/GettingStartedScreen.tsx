import { StyleSheet, View, Image, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox, Divider } from "@rneui/themed";
import SlideGuide from "../molecules/SlideGuide";

const guide1 = [
  { imagePath: require("../../../assets/images/guidelines/1.jpg") },
  { imagePath: require("../../../assets/images/guidelines/2.jpg") },
  { imagePath: require("../../../assets/images/guidelines/3.jpg") },
  { imagePath: require("../../../assets/images/guidelines/4.jpg") },
];

const guide2 = [
  { imagePath: require("../../../assets/images/guidelines/5.jpg") },
  { imagePath: require("../../../assets/images/guidelines/6.jpg") },
];

const guide3 = [
  { imagePath: require("../../../assets/images/guidelines/7.jpg") },
];

const guide4 = [
  { imagePath: require("../../../assets/images/guidelines/8.jpg") },
];

const guide5 = [
  { imagePath: require("../../../assets/images/guidelines/9.jpg") },
  { imagePath: require("../../../assets/images/guidelines/10.jpg") },
  { imagePath: require("../../../assets/images/guidelines/11.jpg") },
  { imagePath: require("../../../assets/images/guidelines/12.jpg") },
  { imagePath: require("../../../assets/images/guidelines/13.jpg") },
  { imagePath: require("../../../assets/images/guidelines/14.jpg") },
];

const guide6 = [
  { imagePath: require("../../../assets/images/guidelines/15.jpg") },
  { imagePath: require("../../../assets/images/guidelines/16.jpg") },
];

const guide7 = [
  { imagePath: require("../../../assets/images/guidelines/17.jpg") },
  { imagePath: require("../../../assets/images/guidelines/18.jpg") },
  { imagePath: require("../../../assets/images/guidelines/19.jpg") },
  { imagePath: require("../../../assets/images/guidelines/20.jpg") },
  { imagePath: require("../../../assets/images/guidelines/21.jpg") },
];

const guide8 = [
  { imagePath: require("../../../assets/images/guidelines/22.jpg") },
  { imagePath: require("../../../assets/images/guidelines/23.jpg") },
];

const guide9 = [
  { imagePath: require("../../../assets/images/guidelines/24.jpg") },
];

const guide10 = [
  { imagePath: require("../../../assets/images/guidelines/25.jpg") },
  { imagePath: require("../../../assets/images/guidelines/26.jpg") },
];

const guide11 = [
  { imagePath: require("../../../assets/images/guidelines/27.jpg") },
];

const guide12 = [
  { imagePath: require("../../../assets/images/guidelines/31.jpg") },
  { imagePath: require("../../../assets/images/guidelines/32.jpg") },
  { imagePath: require("../../../assets/images/guidelines/33.jpg") },
  { imagePath: require("../../../assets/images/guidelines/34.jpg") },
];

export default function GettingStartedScreen() {
  const [showSection, setShowSection] = useState("");

  return (
    <ScrollView
      bounces={false}
      bouncesZoom={false}
      showsVerticalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      <Text style={styles.title}>Guidelines </Text>

      <CheckBox
        title="What is Re-Share?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "1"}
        onPress={() => {
          setShowSection(showSection === "1" ? "" : "1");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "1" && (
        <View
          style={[
            styles.checkBoxContainerInside,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Image
            style={{ width: "90%", height: 400 }}
            source={require("../../../assets/images/guidelines/intro.jpg")}
          />
        </View>
      )}

      <CheckBox
        title="I am looking for a second-hand item. How can I do that?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "2"}
        onPress={() => {
          setShowSection(showSection === "2" ? "" : "2");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "2" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide1} />
        </View>
      )}

      <CheckBox
        title="How to search for specific items?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "3"}
        onPress={() => {
          setShowSection(showSection === "3" ? "" : "3");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "3" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide2} />
        </View>
      )}

      <CheckBox
        title="How to view items that I liked?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "4"}
        onPress={() => {
          setShowSection(showSection === "4" ? "" : "4");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "4" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide3} />
        </View>
      )}

      <CheckBox
        title="How to view news and announcements?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "5"}
        onPress={() => {
          setShowSection(showSection === "5" ? "" : "5");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "5" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide4} />
        </View>
      )}

      <CheckBox
        title="How to keep track of the status for items I have made an offer?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "6"}
        onPress={() => {
          setShowSection(showSection === "6" ? "" : "6");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "6" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide5} />
        </View>
      )}

      <CheckBox
        title="How to keep track of the status for items I have listed?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "7"}
        onPress={() => {
          setShowSection(showSection === "7" ? "" : "7");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "7" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide6} />
        </View>
      )}

      <CheckBox
        title="How to list my item?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "8"}
        onPress={() => {
          setShowSection(showSection === "8" ? "" : "8");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "8" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide7} />
        </View>
      )}

      <CheckBox
        title="How to view my messages?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "9"}
        onPress={() => {
          setShowSection(showSection === "9" ? "" : "9");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "9" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide8} />
        </View>
      )}

      <CheckBox
        title="How to view the status of my activities?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "10"}
        onPress={() => {
          setShowSection(showSection === "10" ? "" : "10");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "10" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide9} />
        </View>
      )}
      <CheckBox
        title="How to view my profile and edit it?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "11"}
        onPress={() => {
          setShowSection(showSection === "11" ? "" : "11");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "11" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide10} />
        </View>
      )}

      <CheckBox
        title="How to make a payment?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "13"}
        onPress={() => {
          setShowSection(showSection === "13" ? "" : "13");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "13" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide12} />
        </View>
      )}

      <CheckBox
        title="How to logout?"
        checkedIcon="keyboard-arrow-up"
        iconType="material"
        uncheckedIcon="keyboard-arrow-down"
        checked={showSection === "12"}
        onPress={() => {
          setShowSection(showSection === "12" ? "" : "12");
        }}
        containerStyle={styles.checkBoxContainer}
        textStyle={styles.checkboxTitle}
      />

      {showSection === "12" && (
        <View style={styles.checkBoxContainerInside}>
          <SlideGuide guideImages={guide11} />
        </View>
      )}

      <Text style={styles.title}>Policies </Text>
      <View
        style={{
          marginBottom: 100,
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "100%", height: 600 }}
          resizeMode="contain"
          source={require("../../../assets/images/guidelines/policies.jpg")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingTop: 25,
  },
  title: {
    backgroundColor: "#F8F9FB",
    paddingVertical: 15,
    marginVertical: 15,
    paddingHorizontal: 30,
    fontSize: 16,
    fontWeight: "700",
    width: "100%",
  },
  checkBoxContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 30,
  },
  checkBoxContainerInside: {
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  checkboxTitle: {
    fontWeight: "400",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 10,
    marginHorizontal: 40,
    marginTop: 20,
    marginBottom: 25,
  },
});
