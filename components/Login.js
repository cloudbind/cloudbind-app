import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button, TouchableOpacity } from "react-native";
import { TextInput, View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lottie from "lottie-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, {
  SlideInUp,
  SlideInDown,
  SlideInLeft,
  SlideOutRight,
  SlideInRight,
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";
import * as env from "../env.js";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: env.ExpoClientId,
    iosClientId: env.iosClientId,
    androidClientId: env.androidClientId,
    webClientId: env.webClientId,
  });

  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(env.RootApi + "/auth/cloudbind/login", {
        email: email.trim(),
        password: password.trim(),
      });
      if (response.status === 200) {
        const user = JSON.stringify(response.data.data.user);
        await AsyncStorage.setItem("token", response.data.data.token);
        await AsyncStorage.setItem("user", user);
        if (!response.data.data.user.isActivated) {
          navigation.replace("Activate");
        } else {
          navigation.replace("Home");
        }
      } else {
        alert("Invalid Credentials!");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
    setIsLoading(false);
    // if (email.trim() === "xxx" && password.trim() === "xxx") {
    //   await AsyncStorage.setItem("token", "abc");
    //   navigation.replace("Home");
    // }
  };

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      async function getUserInfo() {
        try {
          const userInfoResponse = await axios.post(
            env.RootApi + "/auth/google/signin",
            {
              accessToken: access_token,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (
            userInfoResponse.status === 200 ||
            userInfoResponse.status === 201
          ) {
            const user = JSON.stringify(userInfoResponse.data.data.user);
            await AsyncStorage.setItem(
              "token",
              userInfoResponse.data.data.token
            );
            await AsyncStorage.setItem("user", user);
            if (userInfoResponse.data.data.user.username === null || userInfoResponse.data.data.user.username === undefined) {
              navigation.replace("EnterUsername");
            } else {
              navigation.replace("Home");
            }
          } else {
            alert("Something went wrong!");
          }
        } catch (error) {
          alert(error.response.data.message);
        }
      }
      getUserInfo();
    }
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        let user = await AsyncStorage.getItem("user");
        user = JSON.parse(user);
        if (
          (user.loginProvider === "GOOGLE" && user.username === null) ||
          user.username === undefined
        ) {
          navigation.replace("EnterUsername");
        } else if (
          user.loginProvider === "CLOUD BIND" &&
          user.isActivated === false
        ) {
          navigation.replace("Activate");
        } else {
          navigation.replace("Home");
        }
      }
    };
    checkToken();
  }, [response]);

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout.duration(400)}
    >
      <View style={styles.containeradjust}>
        <Lottie
          source={require("../assets/animation.json")}
          loop
          autoPlay
          style={{ width: 250, marginTop: 55 }}
        />
      </View>
      <Text style={styles.title}>Login</Text>
      <View style={styles.container2}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(val) => setEmail(val)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(val) => setPassword(val)}
          value={password}
          secureTextEntry={true}
        />

        {isLoading ? (<Lottie
          source={require("../assets/loading2.json")}
          loop
          autoPlay
          style={{ width: 50 }}
        />) : (<View style={styles.button}>
          <Button
            title="Login"
            color="black"
            onPress={() => {
              handleLogin();
            }}
          />
        </View>)}
        <View style={styles.signup}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup");
            }}
          >
            <Animated.View
              entering={SlideInRight.duration(1000).delay(500)}
              exiting={SlideOutRight}
              // layout={Layout.duration(1200).delay(5000)}
            >
              <Text style={styles.text2}> Sign Up</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          <View>
            <Text style={{ width: 50, textAlign: "center" }}>Or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        </View>

        <View style={styles.googleButton}>
          <Animated.View
            entering={SlideInDown}
            exiting={SlideInUp}
            layout={Layout.duration(1200)}
          >
            <TouchableOpacity onPress={() => promptAsync()}>
              <FontAwesome5
                name="google"
                size={50}
                color="black"
                style={{ textAlign: "center", margin: 10 }}
              />
              <Text>Sign In With Google</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
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
    // marginTop: 20,
    marginBottom: -10,
    backgroundColor: "#fff",
  },
  containeradjust: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: -10,
    backgroundColor: "#fff",
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
    marginTop: 170,
  },
  googleButton: {
    // backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    textAlign: "center",
  },
  lottieAdjust: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: -10,
  },
  signup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  text: {
    fontSize: 15,
  },
  text2: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
