import React from 'react'
import { Text, StyleSheet, View, Switch, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as env from "../env.js";
import { LinearGradient } from 'expo-linear-gradient';
import Lottie from "lottie-react-native";
function ProfilePage({ navigation }) {
  const [user, setUser] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [userPhoto, setUserPhoto] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  // random string generator
  const randomString = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters[Math.random() % charactersLength]
    }
    return result;
  };

  React.useEffect(() => {
    async function getUser() {
      const user = await AsyncStorage.getItem("user");
      setUser(JSON.parse(user));
      setIsVisible(JSON.parse(user).isVisible);
    }
    getUser();
    setUserPhoto(`https://robohash.org/${randomString(3)}.png`);
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
        alert("Visibility Updated!");
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
      <LinearGradient
              colors={["#ffff", "lightgrey", "black"]}
              start={{ x: 0.9, y: 0 }}
              end={{ x: 0, y: 0.5 }}
              style={styles.container}
            >
      <View style={styles.userAvatar}>
        <Image source={{uri: userPhoto}} style={{width: 100, height: 100, borderRadius: 50}}/>
      </View>
      <Text style={styles.username}>{user?.username}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      {/* toggle button to set visibility */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.visibility}>Visibility: </Text>
      {isLoading ? (<Lottie
            source={require("../assets/loading.json")}
            loop
            autoPlay
            style={{ width: 40 }}
          />) : <Switch
          trackColor={{ false: "black", true: "lightblue" }}
          thumbColor={isVisible ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={adjustVisibility}
          value={isVisible}
        />}
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
  )
}

export default ProfilePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 9
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userAvatarText: {
    fontSize: 50,
    color: 'black',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  visibility: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 5,
    color: 'white'
  },
  logoutButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  }
})
