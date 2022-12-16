// Get all the photos from phone gallery
// and display them in a grid view

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import FormData from 'form-data';
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import PageLoading from "./pageLoading";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import * as env from "../env.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Gallery({ navigation }) {

  const [user, setUser] = useState(null);

  const [imageStyle, setImageStyle] = useState({
    image: {
      width: 100,
      height: 100,
      margin: 5,
      opacity: 1,
    },
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photos, setPhotos] = useState([]);

  const handleSelect = (item) => {
    setSelectedPhotos([...selectedPhotos, item]);
    setPhotos(photos.filter((photo) => photo.id !== item.id));
  };

  const handleUnselect = (item) => {
    setSelectedPhotos(selectedPhotos.filter((photo) => photo.id !== item.id));
    setPhotos([item, ...photos]);
  };

  const handleRemoveAll = () => {
    setPhotos([...selectedPhotos, ...photos]);
    setSelectedPhotos([]);
  };

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const { assets } = await MediaLibrary.getAssetsAsync({
          first: 1000,
          sortBy: [MediaLibrary.SortBy.creationTime],
          mediaType: [MediaLibrary.MediaType.photo],
        });
        setPhotos(assets);
        setIsLoaded(true);
      }
      let us = await AsyncStorage.getItem("user");
      setUser(JSON.parse(us));
    })();
  }, []);
  //   async function getPhotos() {
  //     const { assets } = await MediaLibrary.getAssetsAsync({
  //       first: 1000,
  //       sortBy: [MediaLibrary.SortBy.creationTime],
  //       mediaType: [MediaLibrary.MediaType.photo],
  //     });
  //     setIsLoaded(true);
  //     setPhotos(assets);
  //   }
  //   getPhotos();
  // }, []);

  if (!isLoaded) {
    return <PageLoading />;
  }

  // var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=';



  const handleSubmit = async () => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to upload ${selectedPhotos.length} photos?`,
      [
        {
          text:'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            // let photoData = [];
            // await selectedPhotos.map(async (photo) => {
            //   const base64 = await FileSystem.readAsStringAsync(photo.uri, {
            //     encoding: 'base64',
            //   });
            //   photoData.push(base64);
            // });
            const formData = new FormData();
            selectedPhotos.forEach((image, i) => {
              formData.append('files', {
                ...image,
                uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                name: `image-${i}`,
                type: 'image/jpeg', // it may be necessary in Android. 
              });
            });
            try{
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(
              "http://192.168.29.171:5001/api/upload",formData,
              {
                headers: {
                  "Content-Type":'multipart/form-data',
                  Authorization: "Bearer " + token,
                },
              }
            );
            if(response.status === 201){
              alert("Uploaded Successfully");
            }
            else{
              alert("Upload Failed");
            }
          }catch(error){
            console.log(error);
          }
          }},
      ]
    )
  };

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        { user ? (
          <Text style={styles.usernameText}>Hello, {user.username}!</Text>
    )
        : null}
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          selected={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handleSelect(item);
              }}
            >
              <Image source={{ uri: item.uri }} style={imageStyle.image} />
            </TouchableOpacity>
          )}
        />
      </View>
      <Text style={styles.horizontalLine}>
        -------------------------------------
      </Text>
      {selectedPhotos.length > 0 ? (
        <View style={styles.container}>
          <FlatList
            data={selectedPhotos}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.image}
                onPress={() => {
                  handleUnselect(item);
                }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={imageStyle.image}
                  resizeMode="cover"
                />
                <View style={styles.selected}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.uploadLeft}>
            <View style={{marginRight: 10}}>
          <Text>Total Selected: {selectedPhotos.length}</Text>
          </View>
          <View>
          <TouchableOpacity onPress={handleRemoveAll}>
            <Text style={styles.remove}> Remove All </Text>
          </TouchableOpacity>
          </View>
          <View style={{marginLeft: 40}}>
          {/* <Image style={{width: 100, height: 50, borderWidth: 1, borderColor: 'red'}} source={{uri: base64Icon}}/> */}
          <TouchableOpacity onPress={handleSubmit}>
            <AntDesign name="checkcircle" size={40} color="black" />
          </TouchableOpacity>
          </View>
          </View>
          {/* <View style={styles.bottomBar}>
            <View style={styles.bottomBarLeft}>
              <Text style={styles.bottomBarText}>
                {selectedPhotos.length} selected
              </Text>
            </View>
          </View> */}
        </View>
      ) : (
        <View style={styles.container}>
          <Text>No photos selected yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  header: {
    fontWeight: "bold",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    // backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bottomBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  bottomBarText: {
    fontSize: 16,
    color: "#000",
  },
  remove: {
    textAlign: "center",
    color: "red",
    textDecorationLine: "underline",
    // marginVertical: 5,
  },
  selected: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    marginVertical: 10,
  },
  username: {
    width: "100%",
    height: 50,
    // backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  usernameText: {
    fontSize: 16,
    color: "#000",
  },
  uploadLeft: {
    textAlign: "left",
    color: "green",
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
