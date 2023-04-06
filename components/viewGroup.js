import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function ViewGroup({ route, navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={35} color="white" />
        </TouchableOpacity>
        <View style={{ width: "75%", justifyContent:"center", alignItems:"center" }}><Text style={styles.headerText}>Group :- {route.params.name}</Text></View>
      </View>
      <View style={styles.createdBy}>
        <Text style={styles.text}>Created By: {route.params.parent.name}</Text>
        <Text style={styles.text}>On: {route.params.createdAt.replace(/-/g,"/").substring(0,10)}</Text>
      </View>
      <View style={styles.createdBy}>
      <Text style={styles.text}>Members:</Text>
      {route.params.users.length === 0 && <Text style={styles.text}>0</Text>}
      <ScrollView style={{maxHeight:50}} horizontal={true}>
        {route.params.users.map((member) => {
          return <Text style={styles.text} key={member.id}>{member.name}</Text>;
        })}
        </ScrollView>
      </View>
      <View style={styles.uploadButton}>
        <TouchableOpacity onPress={() => alert("Upload Successful")}>
          <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
            Upload Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    flexDirection: "column",
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
    marginTop: 35,
  },
  createdBy: {
    height: 50,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 20,
  },
  uploadButton: {
    height: 50,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "lightblue",
    borderRadius: 50,
  },
});

export default ViewGroup;
