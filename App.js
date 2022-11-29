import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Gallery from "./components/gallaery";
import Login from "./components/Login";
import EnterUsername from "./components/enterUsername";
import OtpVerificationScreen from "./components/otpVerification";
import SignUp from "./components/signUp";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("authEmailId");
          navigation.replace("Login");
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  return (
    
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color = "black", size = 24 }) => {
          let iconName;

          if (route.name === "Gallery") {
            iconName = "home";
          } else if (route.name === "Settings") {
            iconName = "save";
          }

          // You can return any component that you like here!
          return <Entypo name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Gallery"
        component={Gallery}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    // <Login />
    // </View>
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Gallery />
    // </View>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Activate'
          component={OtpVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnterUsername"
          component={EnterUsername}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignUp}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Settings" component={Settings} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
