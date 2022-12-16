import React, { useEffect } from "react";
import Lottie from "lottie-react-native";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
} from "react-native";
import axios from "axios";
import * as env from "../env.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EnterUsername({ navigation }) {
  const [username, setUsername] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleUsername = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        env.RootApi + "/auth/google/set-username",
        {
          username: username.trim(),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        const user = JSON.stringify(response.data.data.user);
        await AsyncStorage.setItem("token", response.data.data.token);
        await AsyncStorage.setItem("user", user);
        navigation.replace("Home");
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  //  React.useEffect(() => {
  // async function removeToken() {
  //   await AsyncStorage.removeItem('token');
  //   await AsyncStorage.removeItem('user');
  //   await AsyncStorage.removeItem('authEmailId');

  // }
  // removeToken();
  // }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Lottie
          source={require("../assets/username.json")}
          loop
          autoPlay
          style={{ width: 250 }}
        />
        <Text style={styles.title}>Enter Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(value) => {
            setUsername(value);
          }}
        />
        {isLoading ? (
          <Lottie
            source={require("../assets/loading2.json")}
            loop
            autoPlay
            style={{ width: 50 }}
          />
        ) : (
          <View style={styles.button}>
            <Button title="Submit" color="black" onPress={handleUsername} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default EnterUsername;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    width: 250,
    borderRadius: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    width: 200,
    margin: 10,
  },
});
