import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Switch,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as env from "../env.js";
import * as Google from "expo-auth-session/providers/google";
import { LinearGradient } from "expo-linear-gradient";
import Lottie from "lottie-react-native";
import PageLoading from "./pageLoading.js";
function ProfilePage({ navigation }) {
  const [user, setUser] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [userPhoto, setUserPhoto] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMainLoading, setIsMainLoading] = React.useState(true);
  const [isDriveConnected, setIsDriveConnected] = React.useState(false);
  const [isDriveLoading, setIsDriveLoading] = React.useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: env.ExpoClientId,
      clientSecret: env.ExpoClientSecret,
      scopes: ["https://www.googleapis.com/auth/drive"],
      accessType: "offline",
    },
    {
      authorizationEndpoint: "https://developers.google.com/oauthplayground",
    }
  );
  // random string generator
  const randomString = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * 100) % charactersLength];
    }
    return result;
  };

  async function getUser() {
    setIsMainLoading(true);
    const user = await AsyncStorage.getItem("user");
    setUser(JSON.parse(user));
    setIsVisible(JSON.parse(user).isVisible);
    setUserPhoto(`https://robohash.org/${randomString(3)}.png`);
    setIsMainLoading(false);
  }

  React.useEffect(() => {
    getUser();
  }, []);
  const adjustVisibility = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await axios.patch(
        env.RootApi + "/user/setting/visibility",
        {
          isVisible: !isVisible,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        const user = JSON.stringify(response.data.data.user);
        await AsyncStorage.setItem("user", user);
        setUser(JSON.parse(user));
        setIsVisible(JSON.parse(user).isVisible);
        setIsLoading(false);
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const ConnectGoogleDrive = async () => {
    setIsDriveLoading(true);
    if (!isDriveConnected) {
      const result = await promptAsync();
      if (result.type === "success") {
        try{
        const dat = {
          grant_type: 'authorization_code',
          code: result.params.code,
          code_verifier: null,
          client_id: env.ExpoClientId,
          client_secret: env.ExpoClientSecret,
          redirect_uri: 'https://developers.google.com/oauthplayground'
        };
        console.log(dat);
        const resp = await axios.post('https://oauth2.googleapis.com/token', dat);
        console.log(resp);
      }catch(err){
        console.log(err.response);
      }
        // alert("Access token: " + resp.access_token);
      }
      setIsDriveConnected(true);
    } else {
      setIsDriveConnected(false);
    }
    setIsDriveLoading(false);
  };

  if (isMainLoading) return <PageLoading />;

  return (
    <LinearGradient
      colors={["lightblue", "lightgrey", "black"]}
      start={{ x: 0.7, y: 0.1 }}
      end={{ x: 0.9, y: 0.3 }}
      style={styles.container}
    >
      <View style={styles.userAvatar}>
        <Image
          source={{ uri: userPhoto }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </View>
      <Text style={styles.username}>{user?.username.toUpperCase()}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      {/* toggle button to set visibility */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.visibility}>Visibility: </Text>
        {isLoading ? (
          <Lottie
            source={require("../assets/loading.json")}
            loop
            autoPlay
            style={{ width: 40 }}
          />
        ) : (
          <Switch
            trackColor={{ false: "blue", true: "lightblue" }}
            thumbColor={isVisible ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={adjustVisibility}
            value={isVisible}
          />
        )}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.visibility}>Google Drive: </Text>
        {isDriveLoading ? (
          <Lottie
            source={require("../assets/loading.json")}
            loop
            autoPlay
            style={{ width: 40 }}
          />
        ) : (
          <Switch
            trackColor={{ false: "blue", true: "lightblue" }}
            thumbColor={isVisible ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={ConnectGoogleDrive}
            value={isDriveConnected}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("authEmailId");
          navigation.replace("Login");
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 9,
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  userAvatarText: {
    fontSize: 50,
    color: "black",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "grey",
  },
  email: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "grey",
  },
  visibility: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5,
    color: "grey",
  },
  logoutButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
});
