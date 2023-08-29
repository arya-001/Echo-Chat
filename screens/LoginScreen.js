import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage'



const LoginScreen = () => {
  // Email
  const [email, setEmail] = useState("");

  //Password
  const [password, setPassword] = useState("");

  //Navigation
  const navigation = useNavigation();


  //Handle Login Button 

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    }

    //check if email password are provided
    

    axios.post("http://192.168.1.103:8081/login", user).then((response)=>{
     console.log(response);
     const token = response.data.token;
     AsyncStorage.setItem("authToken",token);
    // Alert.alert("Login Successful", "Axios was neat  !")
     navigation.navigate("Main");
    }).catch((error)=>{
      console.log("Login Failed ", error);
      Alert.alert("Login Failed", "Axios a culprit !")
    })
  }


  useEffect(()=>{
    const checkLoginStatus = async() =>{
      try {
          const token = await AsyncStorage.getItem("authToken");
          if(token){
            setTimeout(()=>{
              navigation.replace("Main");
            },400);
          
          }
        }catch(error){
          console.log("error",error)
    
    }
  };
  checkLoginStatus();
  },[]);





  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
        padding: 10,
        alignItems: "center",
      }}
    >

        
{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

      <View style={{ marginTop: 50 }}>
        <Image
          style={{ width: 150, height: 150, resizeMode: "contain" }}
          source={{ uri: "asset:/echo-dark.png" }}
        />
      </View>
      {/* <Text style={{color:"white" }}>LoginScreen</Text> */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 20,
              color: "white",
            }}
          >
            Login To Your Account
          </Text>
        </View>

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

        <View style={{ marginTop: 50, borderColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              borderColor: "#ffffff",
              borderWidth: 1,
              borderRadius: 5,
              padding: 8,
            }}
          >
            <MaterialIcons name="email" size={27} color="white" />
            <TextInput
              //main email
              //main email
              value={email}
              onChangeText={(text) => setEmail(text)}
              //main email
              //main email
              placeholderTextColor="gray"
              placeholder="Enter email"
              style={{
                color: "white",
                borderColor: "white",
                marginVertical: 10,
                width: 300,
                borderBottomWidth: 1,
              }}
            />
          </View>
        </View>
        
{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

        <View style={{ marginTop: 30, borderColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              gap: 15,
              alignItems: "center",
              borderColor: "#ffffff",
              borderWidth: 1,
              borderRadius: 5,
              padding: 8,
            }}
          >
            <FontAwesome5 name="lock" size={24} color="white" />
            <TextInput
              //main password
              //main password
              value={password}
              onChangeText={(text) => setPassword(text)}
              //main password
              //main password
              placeholderTextColor="gray"
              placeholder="Enter password"
              style={{
                color: "white",
                borderColor: "white",
                marginVertical: 10,
                width: 300,
                borderBottomWidth: 1,
              }}
            />
          </View>
        </View>

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <Text style={{ color: "white" }}>Keep me logged in</Text>
          <Text style={{ color: "white", fontWeight: "500" }}>
            Forgot Password?{" "}
          </Text>
        </View>

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

        <View style={{ marginTop: 45, alignItems: "center" }}>
          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              marginTop: 45,
              backgroundColor: "white",
              alignItems: "center",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 20,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Pressable  onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }}>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              Don't have an account? SignUp
            </Text>
          </Pressable>
        </View>
        
{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
