import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native'
import Lottie from "lottie-react-native";
import PageLoading from './pageLoading.js';
import GroupCard from './groupCard.js';
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as env from '../env.js';

function GroupManage({navigation}) {
  const [groups, setGroups] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [groupName, setGroupName] = React.useState("");
  const [groupCode, setGroupCode] = React.useState("");
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isModalVisible2, setModalVisible2] = React.useState(false);

  async function getGroupss() {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(env.RootApi + "/group/view", {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (response.status === 200) {
        setGroups(response.data.data.groups);
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      alert(err.response.data.message)
    }
  }
  
  React.useEffect(() => {
    async function getGroups() {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.get(env.RootApi + "/group/view", {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (response.status === 200) {
          setGroups(response.data.data.groups);
        } else {
          alert("Server Error Occured!");
        }
      } catch (err) {
        alert(err.response.data.message)
      }
      setIsLoading(false);
    }
    getGroups();
  }, []);

  const createGroup = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        env.RootApi + "/group/create",
        {
          name: groupName,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 201) {
        alert("Group created with name "+groupName+" and code "+response.data.data.group.code+" successfully!");
        setModalVisible(false);
        setGroupName("");
        await getGroupss();
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const joinGroup = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        env.RootApi + "/group/join",
        {
          code: parseInt(groupCode),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },

        }
      );
      if (response.status === 200) {
        alert("Group joined successfully!");
        setGroupCode("");
        setModalVisible2(false);
        await getGroupss();
      } else {
        alert("Server Error Occured!");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  if (isLoading) return <PageLoading />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Lottie
            source={require("../assets/gathering.json")}
            loop
            autoPlay
            style={{ width: 75 }}
          />
        <View>
          <Text style={styles.headerText}>Manage Groups</Text>
        </View>
      </View>
      <View style={styles.yourGroupsHeader}>
        <Text style={styles.yourGroupsHeaderText}>Your Groups</Text>
      </View>
        {groups.length === 0 ? (
          <TouchableOpacity onPress={getGroupss}>
            <Text style={{ color: "grey", textAlign:"center", fontWeight:"bold", fontSize:16 }}>You are not in any groups</Text>
            <Lottie
        source={require("../assets/93134-not-found.json")}
        loop
        autoPlay
        style={{ width: 90, marginLeft: 20 }}
      />
          </TouchableOpacity>
        ) : (
          <ScrollView style={{maxHeight:200}} horizontal={true}>
          {groups.map((group) => {
            return (
              <TouchableOpacity key={group._id} onPress={()=>{navigation.navigate("ViewGroup", group)}}>
                <GroupCard data={group} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        )}
        <View style={styles.createGroup}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Create Group
            </Text>
          </TouchableOpacity>
          <Modal visible={isModalVisible} animationType="fade">
            <View style={styles.modal}>
            <Lottie
        source={require("../assets/create-group.json")}
        loop
        autoPlay
        style={{ width: 100 }}
      />
              <Text style={{ fontSize: 30, fontWeight: "bold", color:"white", marginVertical: 20 }}>Enter a group name: </Text>
              <TextInput
                style={{ height: 40, width: 200, borderColor: "white", borderWidth: 2, color:"white", padding:6 }}
                onChangeText={(text) => setGroupName(text)}
                value={groupName}
              />
              <View style={{ justifyContent:"space-between", alignItems:"flex-start", padding:10, flexDirection:"row", width:"35%",marginVertical:25 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ backgroundColor: "red", fontSize: 20, fontWeight: "bold", padding:6, borderRadius:50 }}>
              <AntDesign name="close" size={24} color="black" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createGroup}>
                <Text style={{ backgroundColor: "lightblue", fontSize: 20, fontWeight: "bold", padding:6, borderRadius:50 }}>
                  <AntDesign name="plus" size={24} color="black" />
                </Text>
              </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>


        <View style={styles.joinGroup}>
          <TouchableOpacity onPress={() => setModalVisible2(true)}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Join Group
            </Text>
          </TouchableOpacity>
          <Modal visible={isModalVisible2} animationType="fade">
            <View style={styles.modal}>
            <Lottie
        source={require("../assets/create-group.json")}
        loop
        autoPlay
        style={{ width: 100 }}
      />
              <Text style={{ fontSize: 30, fontWeight: "bold", color:"white", marginVertical: 20 }}>Enter the group code: </Text>
              <TextInput
                style={{ height: 40, width: 200, borderColor: "white", borderWidth: 2, color:"white", padding:6 }}
                onChangeText={(text) => setGroupCode(text)}
                value={groupCode}
              />
              <View style={{ justifyContent:"space-between", alignItems:"flex-start", padding:10, flexDirection:"row", width:"35%",marginVertical:25 }}>
              <TouchableOpacity onPress={() => setModalVisible2(false)}>
              <Text style={{ backgroundColor: "red", fontSize: 20, fontWeight: "bold", padding:6, borderRadius:50 }}>
              <AntDesign name="close" size={24} color="black" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={joinGroup}>
                <Text style={{ backgroundColor: "lightblue", fontSize: 20, fontWeight: "bold", padding:6, borderRadius:50 }}>
                  <AntDesign name="plus" size={24} color="black" />
                </Text>
              </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    flexDirection: "column"
  },
  header: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 50,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5,
    marginTop: 35
  },
  yourGroupsHeader: {
    height: 40,
    width: "100%",
    // flexDirection: "row",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    marginTop: 20,
    marginLeft: 30,
  },
  yourGroupsHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  createGroup: {
    height: 50,
    width: "50%",
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 50,
  },
  joinGroup: {
    height: 50,
    width: "50%",
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 50,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    marginTop: -30
  },

})



export default GroupManage