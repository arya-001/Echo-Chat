import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import EchoScreen from "./screens/EchoScreen";
import { Ionicons } from "@expo/vector-icons";
import ActivityScreen from "./screens/AcitivityScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import EchoPeople from "./screens/EchoPeople";
import MessagesScreen from "./screens/MessagesScreen";
import UserChatMessageScreen from "./screens/UserChatMessageScreen";
const StackNavigator = () => {
  //Hello React Navigation
  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator screenOptions={{ tabBarStyle: { height: 300 } }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarStyle: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="home-sharp" size={30} color="black" />
              ) : (
                <Ionicons name="home-outline" size={30} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Echo"
          component={EchoScreen}
          options={{
            tabBarStyle: "Echo",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome5 name="search" size={24} color="black" />
              ) : (
                <Feather name="search" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarStyle: "Activity",
            tabBarLabelStyle: { color: "black" },
            headerShown: true,
            headerStyle: {backgroundColor:"black"},
            headerStatusBarHeight: 20
 ,           // headerBackground:{ color :"black"},
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="star" size={30} color="black" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarStyle: "Profile",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person-sharp" size={30} color="black" />
              ) : (
                <Ionicons name="person-outline" size={30} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="EchoPeople"
          component={EchoPeople}
          options={{ headerShown: true }}
        /> */}
      <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ headerShown: true }}
        />  
         <Stack.Screen
          name="Chat"
          component={UserChatMessageScreen}
          options={{ headerShown: true }}
        />      
        </Stack.Navigator>
        
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
