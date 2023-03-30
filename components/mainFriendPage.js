import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lottie from "lottie-react-native";
import axios from "axios";
import * as env from "../env.js";
import PageLoading from "./pageLoading.js";

function MainFriendPage({ navigation }) {
  const [search, setSearch] = React.useState("");
  const [freindsList, setFreindsList] = React.useState([]);
  const [myFriendsList, setMyFriendsList] = React.useState([]);
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState({});
  const sendRequest = async (id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        env.RootApi + "/friend/send-request?id=" + id,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        alert("Friend Request Sent!");
        setFreindsList(freindsList.filter((item) => item.id !== id));
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  const sendFriendRequest = async (id, username) => {
    Alert.alert(
      "Send Friend Request?",
      "This will send a friend request to " + username + ".",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => sendRequest(id) },
      ],
      { cancelable: true }
    );
  };
  const fetchDataFriend = async () => {
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    setUser(JSON.parse(user));
    setRefreshing(true);
    try {
      const response = await axios.get(env.RootApi + "/friend/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setMyFriendsList(response.data.data.friends);
      setIsLoading(false);
      setRefreshing(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  React.useEffect(() => {
    setIsLoading(true);
    fetchDataFriend();
    // setTimeout(() => {
    //   setFriendsAnimate(true);
    // }
    // , 3000);
  }, []);

  const fetchData = async () => {
    if (search !== "") {
      setIsSearchLoading(true);
      const token = await AsyncStorage.getItem("token");
      search.replace(/\s/g, "");
      try {
        const response = await axios.get(
          env.RootApi + "/user?search=" + search,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setFreindsList(response.data.data.results);
        setIsSearchLoading(false);
        setRefreshing(false);
      } catch (err) {
        alert(err.response.data.message);
      }
    } else {
      setFreindsList([]);
    }
  };
  React.useEffect(() => {
    fetchData();
    if (search === "") setFreindsList([]);
  }, [search]);

  const [refreshing, setRefreshing] = React.useState(false);

  if (isLoading) return <PageLoading />;

  return (
    <View style={styles.container}>
      <View style={styles.freindsHeader}>
        <View
          style={{
            width: "25%",
            height: "20%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Lottie
            source={require("../assets/fist-bump.json")}
            loop
            autoPlay
            style={{ width: 140 }}
          />
        </View>
        <View style={{ marginLeft: 34, padding: 1 }}>
          <Text style={styles.friendsHeaderText}>
            {user.username.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={24} color="black" />
        <TextInput
          style={styles.input}
          // placeholder={friendsAnimate ? "Search for Friends!" : "Search"}
          placeholder="Search for Friends!"
          onChangeText={(val) => {
            setSearch(val);
            if (val === "") setFreindsList([]);
          }}
          value={search}
        />
      </View>
      {isSearchLoading ? (
        <Lottie
          source={require("../assets/loading2.json")}
          loop
          autoPlay
          style={{ width: 70 }}
        />
      ) : freindsList.length > 0 && search !== "" ? (
        <View style={styles.friendsList}>
          <FlatList
            data={freindsList}
            keyExtractor={(item) => item._id}
            selected={false}
            renderItem={({ item }) => (
              <LinearGradient
                colors={["#ffff", "lightgrey", "black"]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.extremeEnds}
              >
                <View style={styles.friend}>
                  <View style={styles.friendImage}>
                    <Text style={styles.friendImageText}>
                      {item.username[0].toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.friendText}>{item.username}</Text>
                    <Text style={styles.friendName}>{item.name}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    sendFriendRequest(item._id, item.username);
                  }}
                >
                  <FontAwesome name="plus" size={20} color="lightgreen" />
                </TouchableOpacity>
              </LinearGradient>
            )}
          />
        </View>
      ) : freindsList.length === 0 && search !== "" ? (
        <Text style={styles.noFriendsText}>No user found!</Text>
      ) : null}
      <View style={styles.freindsHeader2}>
        <Text style={styles.friendsHeaderText2}>Your Friends</Text>
      </View>
      {myFriendsList.length > 0 ? (
        <View style={styles.friendsList2}>
          <FlatList
            data={myFriendsList}
            keyExtractor={(item) => item._id}
            selected={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchDataFriend}
              />
            }
            renderItem={({ item }) => (
              <LinearGradient
                colors={["#ffff", "lightgrey", "black"]}
                start={{ x: 0.6, y: 0.1 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.extremeEnds}
              >
                <View style={styles.friend}>
                  <View style={styles.friendImage}>
                    <Text style={styles.friendImageText2}>
                      {item.username[0].toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.friendText}>{item.username}</Text>
                    <Text style={styles.friendName}>{item.name}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <FontAwesome name="user" size={20} color="lightblue" />
                </TouchableOpacity>
              </LinearGradient>
            )}
          />
        </View>
      ) : (
        <TouchableOpacity onPressOut={fetchDataFriend}>
        <View
        >
          <Text style={styles.noFriendsText}>
            Ooops, no connections found:(
          </Text>
          <Text style={styles.noFriendsText}>Start sending requests!</Text>
          <Lottie
            source={require("../assets/avocad-bros.json")}
            loop
            autoPlay
            style={{ width: 130, marginLeft: 20 }}
          />
        </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("FriendRequestManage");
        }}
        style={styles.manageRequestsButton}
      >
        <Text style={styles.manageRequestsButtonText}>Manage Requests</Text>
      </TouchableOpacity>
    </View>
  );
}

export default MainFriendPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "black",
  },
  searchBar: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "85%",
    height: 50,
    backgroundColor: "lightgrey",
    // borderBottomWidth: 3,
    // borderBottomColor: "grey",
    borderRadius: 50,
  },
  input: {
    width: "85%",
    backgroundColor: "lightgrey",
    borderRadius: 50,
  },
  freindsHeader: {
    marginTop: 65,
    width: "80%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: 30,
  },
  // friendsHeaderText: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   color: "grey",
  // },
  friend: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  friendText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 10,
  },
  noFriendsText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "grey",
  },
  friendsList: {
    width: "80%",
    height: "auto",
    maxHeight: 250,
    borderBottomWidth: 3,
    borderBottomColor: "black",
    // borderRadius: 10,
    marginTop: 10,
  },
  friendsList2: {
    width: "90%",
    height: "auto",
    maxHeight: 250,
    borderBottomWidth: 3,
    borderBottomColor: "black",
    // borderRadius: 10,
    marginTop: 10,
  },
  friendImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  friendImageText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "lightgreen",
  },
  friendImageText2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "lightblue",
  },
  friendName: {
    fontSize: 13,
    color: "grey",
    marginHorizontal: 10,
  },
  extremeEnds: {
    width: "95%",
    height: 50,
    // marginHorizontal: 10,
    borderRadius: 50,
    marginVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  friendsHeaderText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    marginHorizontal: 14,
    color: "white",
  },
  friendsHeaderText2: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginHorizontal: 14,
    color: "grey",
  },
  freindsHeader2: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  manageRequestsButton: {
    width: "80%",
    height: 50,
    backgroundColor: "grey",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  manageRequestsButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});
