import { AntDesign, Entypo } from "@expo/vector-icons";
import PageLoading from "./pageLoading";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

export default function clickPhoto() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <PageLoading />;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View style={styles.shareContainer}>
          <View style={styles.button}>
            <TouchableOpacity onPress={sharePic} style={styles.roundButton2}>
              <Entypo name="share" size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            {hasMediaLibraryPermission ? (
              <TouchableOpacity onPress={savePhoto} style={styles.roundButton2}>
                <Entypo name="save" size={25} color="black" />
              </TouchableOpacity>
            ) : undefined}
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => setPhoto(undefined)}
              style={styles.roundButton2}
            >
              <Entypo name="cross" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={takePic} style={styles.roundButton1}>
          <AntDesign name="camera" size={35} color="black" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
    maxHeight: 500,
    alignItems: "center",
    borderRadius: 100,
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "column",
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  button: {
    margin: 10,
  },
  shareContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
  roundButton1: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "orange",
  },
  roundButton2: {
    width: 47,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "orange",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
    minHeight: 400,
  },
});
