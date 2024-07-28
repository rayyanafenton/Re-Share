import * as React from "react";
import { StyleSheet, Image, View, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Text, Button, Input } from "@rneui/themed";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import jwt_decode from "jwt-decode";

WebBrowser.maybeCompleteAuthSession();

export default function AuthenticateScreen({ navigation }: any) {
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/9e6a47d3-2795-4b97-9e52-78b1060629f1/v2.0"
  );
  const clientId = "c1d77eb6-f8f1-45ee-94b7-27685f5a2ba1";

  const [token, setToken] = React.useState<string | null>(null);

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["openid", "profile", "email", "offline_access", "User.Read"],
      redirectUri: makeRedirectUri({
        scheme: "reshare",
        path: "auth",
      }),
      // redirectUri: "ReShare://auth",
    },
    discovery
  );

  const handleTokenReceived = (accessToken: string) => {
    setToken(accessToken);

    const decodedToken: any = jwt_decode(accessToken);

    const decodedUserName = decodedToken.name.toString();
    const decodedUserEmail = decodedToken.upn.toString();

    navigation.navigate("Register", {
      username: decodedUserName,
      email: decodedUserEmail,
    });
  };

  return (
    <View style={styles.container}>
      <Text h1 h1Style={styles.title}>
        Authenticate
      </Text>
      <Text style={styles.subTitle}>Please authenticate your campus email</Text>

      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../../assets/images/icon_login.png")}
        />
      </View>

      <Button
        disabled={!request}
        title="Authenticate Campus Email"
        containerStyle={styles.button}
        onPress={() => {
          promptAsync().then((codeResponse) => {
            if (request && codeResponse?.type === "success" && discovery) {
              exchangeCodeAsync(
                {
                  clientId,
                  code: codeResponse.params.code,
                  extraParams: request.codeVerifier
                    ? { code_verifier: request.codeVerifier }
                    : undefined,
                  redirectUri: makeRedirectUri({
                    scheme: "reshare",
                    path: "auth",
                  }),
                  // redirectUri: "ReShare://auth",
                },
                discovery
              ).then((res) => {
                handleTokenReceived(res.accessToken);
              });
            }
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 70,
    paddingBottom: 50,
    justifyContent: "center",
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
    width: 150,
    height: 150,
  },
  button: {
    marginBottom: 20,
  },
});
