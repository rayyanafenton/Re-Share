import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { Button, Input, Text } from "@rneui/themed";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { FIREBASE_AUTH } from "../../../firebase/Firebaseconfig";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userActions";

import getUserByAuthID from "../../../helper/user/getUserByAuthID";
import showToast from "../../Home/molecules/showToast";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function LoginScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const login = async (values: any) => {
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      if (user) {
        const data = await getUserByAuthID(user.uid);
        if (data) {
          const state = dispatch(setUser(data));
          if (state) navigation.navigate("Home");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const ChangePassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        showToast("Password change request is sent to email", "Green");
      } catch (error) {
        showToast("Error changing password", "Red");
      } finally {
        setLoading(false);
      }
    } else {
      showToast("Please enter your email", "Red");
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
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={login}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              <Text h1 style={styles.title}>
                Login
              </Text>
              <Input
                value={values.email}
                label="Email"
                placeholder="Your campus email"
                labelStyle={styles.inputLabel}
                inputStyle={styles.inputStyle}
                errorStyle={{ color: "red" }}
                errorMessage={touched.email || errors.email ? errors.email : ""}
                autoCapitalize="none"
                onChangeText={(text) => {
                  handleChange("email")(text);
                  setEmail(text);
                  console.log(text);
                }}
              />

              <Input
                value={values.password}
                label="Password"
                placeholder="Your password"
                labelStyle={styles.inputLabel}
                inputStyle={styles.inputStyle}
                errorStyle={{ color: "red" }}
                errorMessage={
                  touched.password || errors.password ? errors.password : ""
                }
                autoCapitalize="none"
                onChangeText={handleChange("password")}
                secureTextEntry={true}
              />
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <Button
                    containerStyle={styles.button}
                    onPress={(event) => handleSubmit()}
                  >
                    Login
                  </Button>
                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>Don't have an account?</Text>
                    <Button
                      type="clear"
                      buttonStyle={styles.linkButton}
                      onPress={() => navigation.navigate("Register")}
                    >
                      Register
                    </Button>
                  </View>
                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>Forget password?</Text>
                    <Button
                      type="clear"
                      buttonStyle={styles.linkButton}
                      onPress={() => ChangePassword()}
                    >
                      Reset Password
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
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    background: "#F8F9FB",
    marginBottom: 20,
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
