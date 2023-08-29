import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const UserChatMessageScreen = () => {
  const [showEmojiBoard, setEmojiBoard] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const route = useRoute();
  const [selectedImage, setSelectedImage] = useState("");
  const { receiverId } = route.params;
  const { userId, setUserId } = useContext(UserType);
  const [receiverData, setReceiverData] = useState();

  const navigation = useNavigation();

  const scrollView = useRef(null);
    useEffect (() => {
      scrollToBottom();
    },[]);

    const scrollToBottom = () => {
      if(scrollView.current){
        scrollView.current.scrollToEnd({animated:false});
      }
    };

    const handleContentSizeChange =()=>{
      scrollToBottom()
    }



  const handleEmojiBoard = () => {
    setEmojiBoard(!showEmojiBoard);
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.103:8081/messages/${userId}/${receiverId}`
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

  const handleSend = async (messageType, imageUrl) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("receiverId", receiverId);

      //
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUrl,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("message", message);
      }

      const response = await fetch("http://192.168.1.103:8081/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");
      }
      fetchMessages();
    } catch (error) {
      console.log("error in send the message user to user");
    }
  };

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.103:8081/user/${receiverId}`
        );
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }

        const data = await response.json();
        setReceiverData(data);
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchRecepientData();
  }, []);

  console.log("receiverData", receiverData);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="md-arrow-back-outline"
            size={24}
            color="black"
          />

          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: receiverData?.image }}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {receiverData?.username}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alighItems: "center", gap: 10 }}>
            <Ionicons name="arrow-redo" size={24} color="black" />
            <Ionicons name="arrow-undo" size={24} color="black" />
            <FontAwesome name="bookmark" size={24} color="black" />
            <MaterialCommunityIcons
            onPress={() => deleteMessages(selectedMessages)}
              name="delete-empty"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [receiverData, selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch("http://192.168.1.103:8081/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        setSelectedMessages((prevSelectedMessages) =>
        prevSelectedMessages.filter((id) => !messageIds.includes(id))
      );

        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  };

  console.log("messages", selectedMessages);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      handleSend("image", result.uri);
    }
  };

  const handleSelect = (message) => {
    //check if the message is already selected
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView ref={scrollView} contentContainerStyle ={{flexGrow:1}} onContentSizeChange={handleContentSizeChange}>
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id);

            return (
              <Pressable
                onLongPress={() => handleSelect(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 8,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 8,
                      },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 17,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {item?.message}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: "right",
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.messageType === "image") {
            const baseUrl = "/echo-app/api/files";
            const imageUrl = item.imageUrl;
            const filename = imageUrl.split("/").pop();
            const source = { uri: baseUrl + filename };

            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 8,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        maxWidth: "60%",
                        borderRadius: 8,
                      },
                ]}
              >
                <View>
                  <Image
                    source={source}
                    style={{ width: 200, height: 200, borderRadius: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: "right",
                      color: "gray",
                      marginTop: 5,
                      position: "absolute",
                      right: 19,
                      color: "gray",
                      bottom: 7,
                    }}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderTopWidth: 5,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiBoard ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiBoard}
          name="emoji-happy"
          size={28}
          color="black"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            marginLeft: 6,
            marginRight: 8,
            height: 50,
            borderWidth: 1,
            borderColor: "#dddddd",
            padding: 10,
            fontSize: 17,
            borderRadius: 10,
          }}
          placeholder="Type Your Message"
        />

        <Entypo onPress={pickImage} name="camera" size={28} color="gray" />
        <Pressable
          onPress={() => {
            handleSend("text");
          }}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 16,
            marginBottom: 2,
            marginLeft: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
            Send
          </Text>
        </Pressable>
      </View>

      {showEmojiBoard && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 200 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default UserChatMessageScreen;

const styles = StyleSheet.create({});
