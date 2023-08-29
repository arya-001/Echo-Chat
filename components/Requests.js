import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const Requests = ({ item, requests, setRequests }) => {
  const { userId, setUserId } = useContext(UserType);

  const navigation = useNavigation();

  const acceptRequest = async (requestId) => {
    try {
      const response = await fetch(
        "http://192.168.1.103:8081/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: requestId,
            receiverId: userId,
          }),
        }
      );

      if (response.ok) {
        setRequests(requests.filter((request) => request._id !== requestId));
        navigation.navigate("Messages");
      }
    } catch (err) {
      console.log("Error",err);
    }
  };

  return (
    <Pressable>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "black",
          borderRadius: 6,
          margin: 2,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{ uri: item.image }}
        />

        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: "white", textAlign: "left" }}>
            {item.username}
          </Text>
          {/* <Text>{item.email}</Text> */}
        </View>

        <Pressable
          onPress={() => {
            console.log("Button clicked");
            acceptRequest(item._id);
          }}
          style={{
            backgroundColor: "#ffbf00",
            padding: 10,
            marginLeft: 10,
            width: 100,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>Accept</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default Requests;

const styles = StyleSheet.create({});
