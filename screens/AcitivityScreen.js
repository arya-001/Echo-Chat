// import React, {  } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState, useLayoutEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import Client from "../components/Client.";
import Requests from "../components/Requests";


const ActivityScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect (()=>{
      navigation.setOptions({
        headerTitle:"",
        
        headerLeft:() => (
          <Text style={{padding: 10, fontSize: 17, fontWeight: "bold", color:"white"}}>Notifications</Text>
        ),
        headerRight:() => (
          <View style={{flexDirection: "row-reverse", alignItems:"center", gap:8, paddingLeft: 10}}>
                      <MaterialCommunityIcons  onPress={() => navigation.navigate("Messages")} name="message-badge" size={25} color="white" />
                     {/* <Ionicons  onPress={() => navigation.navigate("EchoPeople")} name="people" size={30} color="black" /> */}

          </View>
        )
        
      })
  })



/*#############################################################*/
/*#############################################################*/
/*#############################################################*/
/*#############################################################*/
/*#############################################################*/
/*#############################################################*/
/*#############################################################*/



  const [selectedButton, setSelectedButton] = useState("echo");
  const [content, setContent] = useState("echo content");
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
    const [requests, setRequests] = useState([]);
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    const getUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodeToken = jwt_decode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
      axios
        .get(`http://192.168.1.103:8081/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
          // console.log(response.data +"Userdata");
        })
        .catch((error) => {
          console.log("I Failed getting Friends", error);
        });
    };
    getUsers();
  }, []);

  console.log("users", users);



  useEffect(() => {
    const getUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodeToken = jwt_decode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
      axios
        .get(`http://192.168.1.103:8081/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
          // console.log(response.data +"Userdata");
        })
        .catch((error) => {
          console.log("I Failed getting Friends", error);
        });
    };
    getUsers();
  }, []);

  console.log("users", users);


 useEffect(() => {
    
const getFriendRequests = async () => {
    try {
        const response = await axios.get(`http://192.168.1.103:8081/friend-request/${userId}`);
        if(response.status === 200){
            const friendRequestData = response.data.map((friendRequest)=>({
                _id: friendRequest._id,
                username:friendRequest.username,
                image: friendRequest.image
            }))
            setRequests(friendRequestData);
        }
    }catch(error){
        console.log("error message friendrequest ",error);
    }
}

    getFriendRequests();
 },[]);


console.log("requests", requests);


/*########################  Return Continues  ##########################*/
/*#############################################################*/
  return (
    <ScrollView style={{ marginTop: 10 }}>
       
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 8,
      }}
    >
      {/* <TouchableOpacity
        onPress={() => handleButtonClick("all")}
        style={[
          {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: "white",
            borderColor: "#D0D0D0D0",
            borderRadius: 6,
            borderWidth: 0.7,
          },
          selectedButton === "all" ? { backgroundColor: "black" } : null,
        ]}
      >
        <Text
          style={[
            { textAlign: "center", fontWeight: "bold", color: "white" },
            selectedButton === "all"
              ? { color: "white" }
              : { color: "black" },
          ]}
        >
          All
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => handleButtonClick("echo")}
        style={[
          {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: "white",
            borderColor: "#D0D0D0D0",
            borderRadius: 6,
            borderWidth: 0.7,
          },
          selectedButton === "echo" ? { backgroundColor: "black" } : null,
        ]}
      >
        <Text
          style={[
            { textAlign: "center", fontWeight: "bold", color: "white" },
            selectedButton === "echo"
              ? { color: "white" }
              : { color: "black" },
          ]}
        >
          Echo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => { console.log("Request pressed"); handleButtonClick("req")}}
        style={[
          {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: "white",
            borderColor: "#D0D0D0D0",
            borderRadius: 6,
            gap: 10,
            borderWidth: 0.7,
          },
          selectedButton === "req" ? { backgroundColor: "black" } : null,
        ]}
      >
        <Text
          style={[
            { textAlign: "center", fontWeight: "bold", color: "white" },
            selectedButton === "req"
              ? { color: "white" }
              : { color: "black" },
          ]}
        >
          Requests
        </Text>
      </TouchableOpacity>
    </View>

    <View>
      {selectedButton === "echo" && (
        <View style={{marginTop:2}}>
          {users?.map((item, index) => (
            <Client key={index} item={item} />
          ))}
        </View>
      )} 
    </View>
    <View>
      {selectedButton === "req" && (
        <View style={{marginTop:2}}>
          {requests.length > 0 && <Text> Your Follow Requests</Text>}
          {requests?.map((item, index) => (
            <Requests key={index} item={item} requests = {requests} setRequests={setRequests} />
          ))}
        </View>
      )} 
    </View>
  </ScrollView>
);
};

export default ActivityScreen

const styles = StyleSheet.create({})