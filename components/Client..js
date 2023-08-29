import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";

const Client = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [unfollowRequest, setUnFollowRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const [followRequests, setFollowRequests] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.103:8081/friend-requests/sent/${userId}`
        );

        const data = await response.json();
        if (response.ok) {
          setFollowRequests(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchFriendRequests();
  }, []);

  console.log("friend requests sent", followRequests);
  

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(`http://192.168.1.103:8081/friends/${userId}`);

        const data = await response.json();

        if (response.ok) {
          setUserFollowers(data);
        } else {
          console.log("error retrieving user friends", response.status);
        }
      } catch (error) {
        console.log("Error message", error);
      }
    };

    fetchUserFriends();
  }, []);

  console.log("user friends", userFollowers);



  const sendFollowRequest = async (currentUserId, selectedUserId) => {
    console.log("sendFollowRequest function called");
    console.log(
      "sendFollowRequest function called with currentUserId:",
      currentUserId
    );
    console.log(
      "sendFollowRequest function called with selectedUserId:",
      selectedUserId
    );

    try {
      const response = await fetch("http://192.168.1.103:8081/follow-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      if (response.ok) {
        setRequestSent(true);
      } else {
        console.log("Follow request failed. Response status:", response.status);
      }
    } catch (error) {
      console.log("Error sending follow request:", error);
    }
  };



  const unFollowRequest = async (loggedUserId, targetUserId) => {
    console.log("unFollowRequest function called");
    console.log(
      "unFollowRequest function called with loggedUserId:",
      loggedUserId
    );
    console.log(
      "unFollowRequest function called with targetUserId:",
      targetUserId
    );

    try {
      const response = await fetch("http://192.168.1.103:8081/unfollow-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loggedUserId, targetUserId }),
      });
      if (response.ok) {
        setUnFollowRequest(true);
      } else {
        console.log("Follow request failed. Response status:", response.status);
      }
    } catch (error) {
      console.log("Error sending follow request:", error);
    }
  }







  return (
    <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 3, marginHorizontal:3 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          paddingVertical:12 ,
          backgroundColor: "black",
          borderRadius: 6,
          margin: 2,
        }}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{ uri: item.image }}
        />
 
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: "white", textAlign: "left", fontSize:16}}>
            {item.username}
          </Text>
          {/* <Text>{item.email}</Text> */}
        </View>
        {userFollowers.includes(item._id) ? (
        <Pressable
          onPress={() => {
            console.log("Button clicked");
            sendFollowRequest(userId, item._id);
          }}
          style={{
            backgroundColor: "#ffbf00",
            padding: 10,
            marginLeft: 10,
            width: 100,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center" }}>Following</Text>
        </Pressable>
         ): requestSent || followRequests.some((follower) => follower._id === item._id) ? (
          <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
        onPress={() => sendFollowRequest(userId, item._id)}
        style={{
          backgroundColor: "#567189",
          padding: 10,
          borderRadius: 6,
          width: 105,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
          Add Friend
        </Text>
      </Pressable>
    )}
     </View>
  </Pressable>
);
};

export default Client;

const styles = StyleSheet.create({});
