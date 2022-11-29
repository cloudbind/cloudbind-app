import React from 'react';
import Lottie from "lottie-react-native";
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Button, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as env from "../env.js"


export default function SignUp({navigation}) {
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [confirmPassword, setConfirmPassword] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [name, setName] = React.useState(null);

  const setUser = async (data) => {
    const user = JSON.stringify(data.user);
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", user);
    await AsyncStorage.setItem("authEmailId", data.authEmailId);
  }

  const handleSignUp = async () => {
    if (password.trim() === confirmPassword.trim()) {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedUsername = username.trim();
      const trimmedName = name.trim();
      try {
      const response = await axios.post(
        env.RootApi + "/cloudbind/signup",
        {
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          username: trimmedUsername,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(response.status === 201){
        // const user = JSON.stringify(response.data.data.user);
        // const token = response.data.data.token;
        // await AsyncStorage.setItem("token", token);
        // await AsyncStorage.setItem("user", user);
        // await AsyncStorage.setItem("authEmailId", response.data.data.authEmailId);
        await setUser(response.data.data);
        navigation.replace("Activate");
      }
      else{
        alert("Server Error Occured!")
      }
    } catch (err) {
      console.log(err);
      alert("Server Error Occured!")
    }
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.container}>
        <Lottie source={require("../assets/signup2.json")} loop autoPlay style={{width: 250, marginVertical: 90}}/>
      </View>
      <Text style={styles.title}></Text>
      <View style={styles.container2}>
      <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(val) => setName(val)}
          value={name}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(val) => setEmail(val)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(val) => setPassword(val)}
          value={password}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={(val) => setConfirmPassword(val)}
          value={confirmPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(val) => setUsername(val)}
          value={username}
        />
        <View style={styles.button}>
          <Button
            title="Sign Up"
            color="black"
            onPress={() => {
              handleSignUp();
            }}
          />
        </View>
        </View>
    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 5,
    margin: 10,
    width: 250,
    borderRadius: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    width: 200,
    margin: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    // backgroundColor: "#fff",
  },
  container2: {
    flex: 4,
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 120,
  },
});