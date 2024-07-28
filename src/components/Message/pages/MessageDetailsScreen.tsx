import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Avatar, ListItem } from "@rneui/themed";
import { Icon } from "@rneui/base";
import getUserById from "../../../helper/user/getUserByID";
import getListingByID from "../../../helper/listing/getListingByID";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { FIREBASE_DB } from "../../../firebase/Firebaseconfig";
import createNotification from "../../../helper/notification/createNotification";

export default function MessageDetailsScreen({ route, navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [messageObject, setMessageObject] = useState(route.params);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[] | null>(null);

  const textInputRef = useRef<TextInput | null>(null);
  const user = useSelector<any, any>((state) => state.user.user);

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const lister = await getUserById(messageObject.listerID);
        const acquirer = await getUserById(messageObject.acquirerID);
        const listing = await getListingByID(messageObject.listingID);

        setMessageObject({
          ...messageObject,
          lister: lister,
          acquirer: acquirer,
          listing: listing,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = () => {
      const msgQuery = query(
        collection(
          doc(FIREBASE_DB, "messages", messageObject.id),
          "user messages"
        ),
        orderBy("timeStamp", "asc")
      );

      const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
        const upMsg = querySnap.docs.map((doc) => doc.data());
        setMessages(upMsg);
        setLoading(false);
      });

      return unsubscribe;
    };

    fetchData();

    const unsubscribe = fetchMessages();

    return () => {
      unsubscribe();
    };
  }, [messageObject.id]);

  const sendMessage = async () => {
    if (message) {
      const timeStamp = serverTimestamp();
      const id = `${Date.now()}`;
      const chat = {
        id: id,
        timeStamp: timeStamp,
        message: message,
        user: user,
      };
      setMessage("");
      await addDoc(
        collection(FIREBASE_DB, "messages", messageObject.id, "user messages"),
        chat
      )
        .then(() => {})
        .catch((err) => alert(err));
      const receiverID =
        user.id === messageObject.acquirer.id
          ? messageObject.lister.id
          : messageObject.acquirer.id;

      await createNotification(
        user.id,
        receiverID,
        "New Message",
        chat.message,
        user.photoURL,
        chat.timeStamp
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Other User Profile", {
            userInfo:
              user.id === messageObject.acquirer.id
                ? messageObject.lister
                : messageObject.acquirer,
          });
        }}
        style={{ marginBottom: 15 }}
      >
        <ListItem>
          <Avatar
            rounded
            source={{
              uri:
                user.photoURL === messageObject.acquirer?.photoURL
                  ? messageObject.lister?.photoURL
                  : messageObject.acquirer?.photoURL,
            }}
            size={50}
          />
          <ListItem.Content>
            <ListItem.Title>
              {user.id === messageObject.acquirer?.id
                ? messageObject.lister?.username
                : messageObject.acquirer?.username}
            </ListItem.Title>
            <ListItem.Subtitle>
              {messageObject.listing?.itemName}
            </ListItem.Subtitle>
          </ListItem.Content>
          <Avatar
            source={{
              uri: messageObject.listing?.imageUris[0],
            }}
            size={50}
          />
        </ListItem>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 70}
      >
        <>
          <ScrollView>
            {loading ? (
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <>
                {messages?.map((msg, index) =>
                  msg.user.id === user.id ? (
                    <View style={styles.message} key={index}>
                      <View
                        style={[
                          styles.submessageRight,
                          { alignSelf: "flex-end" },
                        ]}
                      >
                        <Text style={styles.textRight}>{msg.message}</Text>
                      </View>
                      <View style={{ alignSelf: "flex-end" }}>
                        {msg?.timeStamp?.seconds && (
                          <Text style={styles.timeText}>
                            {new Date(
                              parseInt(msg?.timeStamp?.seconds) * 1000
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.message} key={index}>
                      <View
                        style={[
                          styles.submessageLeft,
                          { alignSelf: "flex-start" },
                        ]}
                      >
                        <Text style={styles.textLeft}>{msg.message}</Text>
                      </View>
                      <View style={{ alignSelf: "flex-start" }}>
                        {msg?.timeStamp?.seconds && (
                          <Text style={styles.timeText}>
                            {new Date(
                              parseInt(msg?.timeStamp?.seconds) * 1000
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </Text>
                        )}
                      </View>
                    </View>
                  )
                )}
              </>
            )}
          </ScrollView>
        </>
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.inputContainer}
            placeholder="Type here..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={(text) => {
              setMessage(text);
            }}
            ref={textInputRef}
          />
          <Icon
            type="material"
            name="send"
            onPress={sendMessage}
            color={"#5A5A5A"}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={{ height: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#F8F9FB",
  },
  bottomContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#BBBBBB",
    borderWidth: 0.5,
    height: 45,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    bottom: 10,
  },
  inputContainer: {
    flex: 1,
  },
  message: {
    marginVertical: 5,
    marginHorizontal: 15,
  },
  submessageRight: {
    backgroundColor: "#FFFFFF",
    borderBottomEndRadius: 0,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  submessageLeft: {
    backgroundColor: "#0077E6",
    borderBottomLeftRadius: 0,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  textRight: {
    fontSize: 16,
    color: "#000000",
  },
  textLeft: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  timeText: {
    fontSize: 10,
    marginVertical: 5,
  },
});
