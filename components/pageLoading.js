// Play video when loading page
import React from 'react';
import Lottie from "lottie-react-native";
import { View } from "react-native";
// import PageLoad from '../assets/PageLoad.mp4';
// import { Video } from 'expo-av';

export default function PageLoading() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Lottie source={require("../assets/loading3.json")} loop autoPlay style={{width: 350}}/>
    </View>
    // <Video
    //   source={PageLoad}
    //   rate={1.0}
    //   volume={1.0}
    //   isMuted={false}
    //   resizeMode="cover"
    //   shouldPlay
    //   isLooping
    //   style={{ width: '100%', height: '100%' }}
    // />
  );
}
