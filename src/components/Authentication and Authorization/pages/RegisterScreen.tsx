import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Input, Text } from "@rneui/themed";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { FIREBASE_AUTH } from "../../../firebase/Firebaseconfig";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/userActions";

import createUser from "../../../helper/user/createUser";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: Yup.string().required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// const RegisterScreen = ({ route, navigation }: any) => {
const RegisterScreen = ({ navigation }: any) => {
  const auth = FIREBASE_AUTH;
  const [loading, setLoading] = useState(false);
  // const [userEmail, setUserEmail] = React.useState("");
  // const [userName, setUserName] = React.useState("");

  const dispatch = useDispatch();

  const register = async (values: any) => {
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const data = await createUser(user.email, values.username, user.uid);
      if (data) {
        dispatch(setUser(data));
      }
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      bounces={false}
      bouncesZoom={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={register}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Text h1 style={styles.title}>
                Register
              </Text>
              <Input
                label="Username"
                placeholder="Please enter your username"
                value={values.username}
                labelStyle={styles.inputLabel}
                inputStyle={styles.inputStyle}
                autoCapitalize="none"
                errorMessage={
                  touched.username && errors.username ? errors.username : ""
                }
                errorStyle={{ color: "red" }}
                onChangeText={handleChange("username")}
              />
              <Input
                label="Email"
                placeholder="Please enter your email"
                value={values.email}
                labelStyle={styles.inputLabel}
                inputStyle={styles.inputStyle}
                autoCapitalize="none"
                errorStyle={{ color: "red" }}
                errorMessage={touched.email && errors.email ? errors.email : ""}
                onChangeText={handleChange("email")}
              />
              <Input
                value={values.password}
                label="Password"
                placeholder="Please enter a password"
                labelStyle={styles.inputLabel}
                inputStyle={styles.inputStyle}
                errorStyle={{ color: "red" }}
                errorMessage={
                  touched.password && errors.password ? errors.password : ""
                }
                autoCapitalize="none"
                onChangeText={handleChange("password")}
                secureTextEntry={true}
              />

              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <Button containerStyle={styles.button} onPress={handleSubmit}>
                    Register
                  </Button>
                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>
                      Already have an account?
                    </Text>
                    <Button
                      type="clear"
                      buttonStyle={styles.linkButton}
                      onPress={() => navigation.navigate("Login")}
                    >
                      Login
                    </Button>
                  </View>
                </>
              )}
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    background: "#F8F9FB",
  },
  title: {
    marginTop: 80,
    marginBottom: 50,
  },
  button: {
    paddingTop: 70,
  },
  linkContainer: {
    flexDirection: "row",
    paddingTop: 30,
    justifyContent: "center",
  },
  linkText: {
    fontSize: 16,
    color: "#86939e",
  },
  linkButton: {
    justifyContent: "center",
    padding: 0,
  },
  inputStyle: {
    fontSize: 14,
  },
  inputLabel: {
    color: "#1C1C1C",
    fontWeight: "700",
    marginBottom: 10,
  },
});
