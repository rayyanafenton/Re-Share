import { StyleSheet, Image, View, ScrollView, Dimensions } from "react-native";
import React from "react";
import { Text, Button } from "@rneui/themed";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function WelcomeScreen({ navigation }: any) {
  return (
    <ScrollView
      bounces={false}
      bouncesZoom={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text h1 h1Style={styles.title}>
          Re-Share
        </Text>
        <Text style={styles.subTitle}>
          Redistribute your unused item. Free up your space. Get extra money.
        </Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../../assets/images/icon_welcomescreen.png")}
          />
        </View>
        <Button
          containerStyle={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>
        <Button onPress={() => navigation.navigate("Register")}>
          Register
        </Button>
      </View>
    </ScrollView>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 80,
    paddingBottom: 50,
    justifyContent: "center",
    background: "#F8F9FB",
  },
  title: {
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#86939e",
  },
  imageContainer: {
    margin: 80,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
  button: {
    marginBottom: 20,
  },
});
