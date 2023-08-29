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
  import React, { useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { MaterialIcons } from "@expo/vector-icons";
  import { FontAwesome5 } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';


  const RegisterScreen = () => {

    //Username
    const [username, setUserName] = useState("");

    // Email
    const [email, setEmail] = useState("");
  
    //Password
    const [password, setPassword] = useState("");

    //Image
    const [image, setImage] = useState("");
  
    //Navigation
    const navigation = useNavigation();





                                                {/* ######## Handle Registration Button ########### */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

  const  handleRegister = () => {
    const user = {
      username: username,
      email: email,
      password: password,
      image: image,
    }

    axios.post("http://192.168.1.103:8081/register", user).then((response) => {
        console.log(response);
        Alert.alert("Registration Successful", "You have registered sucessfully !");
        setUserName("");
        setEmail("")
        setPassword("")
        setImage("")
    }).catch((error) => {
      console.log(" Axios Giving headache , Registration Failed",error);
      Alert.alert("Registration Failed", "Axios a culprit !");

    });
  }













  
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "black",
          padding: 10,
          alignItems: "center",
        }}
      >

        <View style={{ marginTop: 50 }}>
          <Image
            style={{ width: 150, height: 150, resizeMode: "contain" }}
            source={{ uri: "asset:/echo-dark.png" }}
          />
        </View>

  
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
              Register Your Account
            </Text>
          </View>


                                                {/* ######## Username InputText ########### */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

       <View style={{ marginTop: 30, borderColor: "white" }}>
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
             <MaterialIcons name="person" size={32} color="white" />
              <TextInput
                //main username
                //main username
                value={username}
                onChangeText={(text) => setUserName(text)}
                //main username
                //main username
                placeholderTextColor="gray"
                placeholder="Enter username"
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

                                                {/* ######## Email InputText ########### */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

          <View style={{ marginTop: 20, borderColor: "white" }}>
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

                                                {/* ######## Password InputText ########### */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}
  
          <View style={{ marginTop: 20, borderColor: "white" }}>
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
              secureTextEntry={true}
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

                                                {/* ######## Image InputText ########### */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

          <View style={{ marginTop: 20, borderColor: "white" }}>
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
             <MaterialCommunityIcons name="image" size={30} color="white" />
              <TextInput
                //main image
                //main image
                value={image}
                onChangeText={(text) => setImage(text)}
                //main image
                //main image
                placeholderTextColor="gray"
                placeholder="Enter image"
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
  

                                                {/* ######## Forgot / logged ########### */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}


{/* 
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
          </View> */}

                                                {/* ######## Register Button ########### */}

{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}


          <View style={{ marginTop: 45, alignItems: "center" }}>
            <Pressable
              onPress={handleRegister}
              style={{
                width: 200,
                marginTop: 30,
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
                Register
              </Text>
            </Pressable>
          </View>


                                                {/* ######## Go to Login ########### */}
{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Pressable onPress={()=> navigation.goBack()}style={{ marginTop: 20 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Already have an account? Login
              </Text>
            </Pressable>
          </View>


{/* ######################################################################################################################## */}
{/* ######################################################################################################################## */}

        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({});
  