import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import React, { useState, useContext } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

const EchoScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");
  const handlePostSubmit = () => {
    const postData = {
      userId,
    };

    if (content) {
      postData.content = content;
    }

    axios
      .post("http://192.168.1.103:8081/create-post", postData)
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        console.log("error creating post", error);
      });
  };
  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://lh3.googleusercontent.com/ogw/AGvuzYaGCiDJaGEI3YdCKftUd6yUvIjcI6OsC2d2twQi=s32-c-mo",
          }}
        />

        <Text>Sujan_Music</Text>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message..."
          multiline
        />
      </View>

      <View style={{ marginTop: 20 }} />

      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
  );
};

export default EchoScreen;

const styles = StyleSheet.create({});