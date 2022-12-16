import React from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { RollInLeft, RollInRight, LightSpeedInLeft, LightSpeedInRight, RollOutRight, RollOutLeft } from "react-native-reanimated";
import * as env from "../env.js";

export default function SignUp({ navigation }) {
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
  };

  const optionsList = [
    "name",
    "username",
    "email",
    "password",
    "confirmPassword",
  ];

  const [selectedOption, setSelectedOption] = React.useState(optionsList[0]);

  const handleSignUp = async () => {
    if (password.trim() === confirmPassword.trim()) {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedUsername = username.trim();
      const trimmedName = name.trim();
      try {
        const response = await axios.post(
          env.RootApi + "/auth/cloudbind/signup",
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
        if (response.status === 201) {
          // const user = JSON.stringify(response.data.data.user);
          // const token = response.data.data.token;
          // await AsyncStorage.setItem("token", token);
          // await AsyncStorage.setItem("user", user);
          // await AsyncStorage.setItem("authEmailId", response.data.data.authEmailId);
          await setUser(response.data.data);
          navigation.replace("Activate");
        } else {
          alert("Server Error Occured!");
        }
      } catch (err) {
        console.log(err);
        alert("Server Error Occured!");
      }
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.container}>
          <Lottie
            source={require("../assets/signup3.json")}
            loop
            autoPlay
            style={{ width: 290, marginVertical: 90, marginHorizontal: 20 }}
          />
        </View>
        <Text style={styles.title}></Text>
        <View style={styles.container2}>
          {
            <View style={styles.inputContainer}>
              <Animated.Text entering={LightSpeedInLeft} exiting={LightSpeedInRight} style={styles.label}>{selectedOption.toUpperCase()}</Animated.Text>
              <TextInput
                style={styles.input}
                placeholder={selectedOption}
                secureTextEntry={
                  selectedOption === "password" ||
                  selectedOption === "confirmPassword"
                }
                onChangeText={(text) => {
                  if (selectedOption === "name") {
                    setName(text);
                  } else if (selectedOption === "username") {
                    setUsername(text);
                  } else if (selectedOption === "email") {
                    setEmail(text);
                  } else if (selectedOption === "password") {
                    setPassword(text);
                  } else if (selectedOption === "confirmPassword") {
                    setConfirmPassword(text);
                  }
                }}
                value={
                  selectedOption === "name"
                    ? name
                    : selectedOption === "username"
                    ? username
                    : selectedOption === "email"
                    ? email
                    : selectedOption === "password"
                    ? password
                    : selectedOption === "confirmPassword"
                    ? confirmPassword
                    : null
                }
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={
                  selectedOption === "email" ? "email-address" : "default"
                }
              />
            </View>
          }
          {/* <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(val) => setName(val)}
          value={name}
        /> */}
          {/* <TextInput
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
        /> */}
          {/* <Button
            title="Sign Up"
            color="black"
            onPress={() => {
              handleSignUp();
            }}
          /> */}
          {selectedOption !== "confirmPassword" ? (
            <View style={styles.nextPrev}>
              <View style={styles.button}>
                <Animated.View entering={RollInLeft.duration(500)} exiting={RollOutLeft.duration(500)}>
                <Button
                  title="Previous"
                  color="black"
                  onPress={() => {
                    const index = optionsList.indexOf(selectedOption);
                    if (index > 0) {
                      setSelectedOption(optionsList[index - 1]);
                    }
                  }}
                />
                </Animated.View>
              </View>
              <View style={styles.button}>
              <Animated.View entering={RollInRight.duration(500)} exiting={RollOutRight}>
                <Button
                  title="Next"
                  color="black"
                  onPress={() => {
                    const index = optionsList.indexOf(selectedOption);
                    setSelectedOption(optionsList[index + 1]);
                  }}
                />
                </Animated.View>
              </View>
            </View>
          ) : (
            <View style={styles.nextPrev}>
              <View style={styles.button}>
              <Animated.View entering={RollInLeft.duration(500)} exiting={RollOutLeft.duration(500)}>
                <Button
                  title="Previous"
                  color="black"
                  onPress={() => {
                    const index = optionsList.indexOf(selectedOption);
                    if (index > 0) {
                      setSelectedOption(optionsList[index - 1]);
                    }
                  }}
                />
                </Animated.View>
              </View>
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
          )}
          <View style={styles.greetingText}>
            <Text style={styles.greeting}>
              Let's get started{" "}
              <MaterialCommunityIcons
                name="party-popper"
                size={24}
                color="black"
              />
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 5,
    margin: 10,
    width: 260,
    borderRadius: 5,
  },
  button: {
    borderRadius: 100,
    padding: 10,
    width: 140,
    marginTop: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
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
  nextPrev: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    marginVertical: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  greetingText: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    marginVertical: 30,
  },
  greeting: {
    fontSize: 16,
  },
});
