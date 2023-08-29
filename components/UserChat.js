import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserType } from "../UserContext";

const UserChat = ({ item }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [showEmojiBoard, setEmojiBoard] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [receiverData, setReceiverData] = useState();

  /**####################################### Get All Messages to display the last one above ################################################ */
  /**#######################################################################################*/
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.103:8081/messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messages", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  console.log(messages);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );
    const n = userMessages.length;
    return userMessages[n - 1];
  };
  const lastMessage = getLastMessage();
  console.log(lastMessage);

  /**#######################################################################################*/
  /*              End                  */
  /**#######################################################################################*/

  /**####################################### Get timestamp of the last message  ################################################ */
  /**#######################################################################################*/
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  /**#######################################################################################*/
  /*              End                  */
  /**#######################################################################################*/

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", {
          receiverId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#D0D0D0D0",
        borderToWidth: 0,
        padding: 10,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item?.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: "black" }}>
          {item?.username}
        </Text>
        {lastMessage && (
          <Text style={{ marginTop: 5, color: "gray", fontWeight: "500" }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
