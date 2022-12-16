import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lottie from "lottie-react-native";
import * as env from "../env.js";

export default function OtpVerificationScreen({ navigation }) {
  //declarations for input field
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [emailId, setEmailId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  React.useEffect(() => {
    const getEmailId = async () => {
      const authEmailId = await AsyncStorage.getItem("authEmailId");
      setEmailId(authEmailId);
    };
    getEmailId();
  }, []);

  const checkOtp = async () => {
    const emailOtp = value.trim();
    setIsLoading(true);
    const authEmailId = await AsyncStorage.getItem("authEmailId");
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        env.RootApi + "/auth/cloudbind/verify-otp",
        {
          emailOtp: emailOtp,
          authEmailId: authEmailId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        const user = JSON.stringify(response.data.data.user);
        const token = response.data.data.token;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", user);
        navigation.replace("Home");
      } else {
        alert("Invalid OTP!");
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const resendOtp = async () => {
    const user = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        env.RootApi + "/cloudbind/send-otp-email",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 201) {
        await AsyncStorage.setItem("token", response.data.data.token);
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.data.user)
        );
        await AsyncStorage.setItem(
          "authEmailId",
          response.data.data.authEmailId
        );
        alert("OTP sent to your email");
      } else {
        alert("Something went wrong, please try again later");
      }
    } catch (err) {
      console.log(err);
    }
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
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Verify the Authorisation Code</Text>
      <Text style={styles.subTitle}>Sent to {emailId}</Text>
      <Lottie
        source={require("../assets/verify.json")}
        loop
        autoPlay
        style={{ width: 250, marginVertical: 10 }}
      />
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={6}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      {/* View for resend otp  */}
      <TouchableOpacity style={styles.resendOtp} onPress={resendOtp}>
        <Text style={styles.resendOtpText}>Resend OTP</Text>
      </TouchableOpacity>
      {isLoading ? (
        <Lottie
          source={require("../assets/loading2.json")}
          loop
          autoPlay
          style={{ width: 50 }}
        />
      ) : (
        <View style={styles.button}>
          <Button title="Submit" onPress={checkOtp} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    marginStart: 20,
    fontWeight: "bold",
  },
  subTitle: {
    textAlign: "left",
    fontSize: 16,
    marginStart: 20,
    marginTop: 10,
  },
  codeFieldRoot: {
    marginTop: 40,
    width: "90%",
    marginLeft: 20,
    marginRight: 20,
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 28,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },

  button: {
    marginTop: 20,
  },
  resendCode: {
    color: "blue",
    marginStart: 20,
    marginTop: 40,
  },
  resendCodeText: {
    marginStart: 20,
    marginTop: 40,
  },
  resendCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendOtpText: {
    color: "blue",
    marginStart: 20,
    marginTop: 40,
  },
});
