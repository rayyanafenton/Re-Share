import { StyleSheet, View } from "react-native";
import React, { useState } from "react";

import deleteMessage from "../../../helper/message/deleteMessage";

import DeleteItem from "../../Home/molecules/DeleteItemButton";
import MessageCard from "../molecules/MessageCard";

export default function MessageCardList({ messages, navigation }: any) {
  const [messageList, setMessageList] = useState(messages);

  const handleDelete = async (list: any) => {
    await deleteMessage(list.id);
    setMessageList(messageList.filter((m: any) => m.id !== list.id));
  };

  return (
    <View style={styles.container}>
      {messageList.map((message: any) => {
        return (
          <MessageCard
            message={message}
            page={() => {
              navigation.navigate("Message Details", message);
            }}
            renderRightActions={() => (
              <DeleteItem onPress={() => handleDelete(message)}></DeleteItem>
            )}
          />
        );
      })}
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
