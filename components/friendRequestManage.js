import React from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import Lottie from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as env from "../env.js";
import PageLoading from "./pageLoading.js";
function FriendRequestManage({ navigation }) {
  const [friendRequests, setFriendRequests] = React.useState([]);
  const [friendRequestsSent, setFriendRequestsSent] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const acceptRequest = async (id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        env.RootApi + "/friend/accept-request?id=" + id,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        alert("Friend Request Accepted!");
        setFriendRequests(friendRequests.filter((item) => item.id !== id));
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error Occured!");
    }
  };
  const acceptFriendRequest = async (id, username) => {
    Alert.alert(
      "Accept Friend Request",
      "Do you want to accept " + username + "'s friend request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            acceptRequest(id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  React.useEffect(() => {
    setIsLoading(true);
    async function getFriendRequests() {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.get(env.RootApi + "/friend/requests", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.status === 200) {
          setFriendRequests(response.data.data.friendRequests);
        } else {
          alert("Server Error Occured!");
        }
      } catch (err) {
        console.log(err);
      }
    }
    getFriendRequests();

    async function getFriendRequestsSent() {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.get(
          env.RootApi + "/friend/requests-sent",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.status === 200) {
          setFriendRequestsSent(response.data.data.friendRequestsSent);
          setIsLoading(false);
        } else {
          alert("Server Error Occured!");
        }
      } catch (err) {
        console.log(err);
      }
    }
    getFriendRequestsSent();
  }, []);

  if(isLoading) return <PageLoading />

  return (
    <View style={styles.container}>
         
      <View style={styles.freindsHeader}>
        <View
          style={{
            height: "90%",
            justifyContent: "center",
            alignItems: "flex-end",
            marginRight: 0,
            marginLeft: 0,

          }}
        >
          <Lottie
            source={require("../assets/settings2.json")}
            loop
            autoPlay
            style={{ width: 90 }}
          />
        </View>
        <View style={{ marginLeft: 0, padding: 1 }}>
          <Text style={styles.friendsHeaderText}>Manage Requests</Text>
        </View>
      </View>
      <View style={styles.freindsHeader2}>
      <Text style={styles.friendsHeaderText2}>Requests Pending</Text>
      </View>
      {friendRequests.length > 0 ? (
        <View style={styles.friendsList2}>
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item._id}
          selected={false}
          renderItem={({ item }) => (
            <LinearGradient
              colors={["#ffff", "lightgrey", "black"]}
              start={{ x: 0.9, y: 0.2 }}
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
                  acceptFriendRequest(item._id, item.username);
                }}
              >
                <FontAwesome name="check-circle" size={25} color="darkgreen" />
              </TouchableOpacity>
            </LinearGradient>
          )}
        />
      </View>) : (
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}>
        <Text style={{
          fontSize: 15,
          fontWeight: "bold",
        }}>No Requests Pending </Text>
        <Lottie
        source={require("../assets/pending.json")}
        loop
        autoPlay
        style={{ width: 90 }}
      />
        </View>
      )}
<View style={styles.freindsHeader2}>
      <Text style={styles.friendsHeaderText2}>Requests Sent</Text>
      </View>
{friendRequestsSent.length > 0 ? (
        <View style={styles.friendsList2}>
        <FlatList
          data={friendRequestsSent}
          keyExtractor={(item) => item._id}
          selected={false}
          renderItem={({ item }) => (
            <LinearGradient
              colors={["#ffff", "lightgrey", "black"]}
              start={{ x: 0.8, y: 0.9 }}
              end={{ x: 0.7, y: 0 }}
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
              <TouchableOpacity
                onPress={() => {
                }}
              >
                <FontAwesome name="user" size={20} color="orange" />
              </TouchableOpacity>
            </LinearGradient>
          )}
        />
      </View>) : (
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}>
        <Text style={{
          fontSize: 15,
          fontWeight: "bold",
        }}>No Requests Sent</Text>
        <Lottie
        source={require("../assets/plane.json")}
        loop
        autoPlay
        style={{ width: 150, marginTop: -10 }}
      />
        </View>
      )}
    </View>
  );
}

export default FriendRequestManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  freindsHeader: {
    height: 30,
    marginTop: 65,
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  friendsHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  friendsHeaderText2: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginHorizontal: 14,
    color: "grey",
  },
  freindsHeader2: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
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
    color: "white",
  },
  noFriendsText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
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
    marginHorizontal: 15,
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
    color: "darkgreen",
  },
  friendImageText2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
  },
  friendName: {
    fontSize: 13,
    color: "grey",
    marginHorizontal: 10,
  },
  extremeEnds: {
    width: "100%",
    height: 50,
    // marginHorizontal: 10,
    borderRadius: 0,
    marginVertical: 2,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
