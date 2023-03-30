import React, { useState } from "react";
import { View, Button, Text, Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as env from "../env.js";
import favicon from "../assets/favicon.png";
import axios from "axios";
import { getPathFromState } from "@react-navigation/native";

const ExampleComponent = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [request, response, promptAsync] =
  Google.useAuthRequest({
      clientId: env.ExpoClientId,
      scopes: ["https://www.googleapis.com/auth/drive"],
      accessType: "offline",
    });

  React.useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.params.access_token);
    }
  }, [response]);

  const handlePress = async () => {
    const result = await promptAsync();
    if (result.type === "success") {
      console.log(result.params.access_token);
      alert("Access token: " + result.params.access_token);
    }
  };

  return (
    <View style={{flex:1, justifyContent: "center", alignItems:"center"}}>
      <Button title="Log in with Google" onPress={handlePress} />
      {accessToken && <Text>Access token: {accessToken}</Text>}
    </View>
  );
};

export default ExampleComponent;
