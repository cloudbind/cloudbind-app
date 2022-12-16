import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainFriendPage from './mainFriendPage';
import FriendRequestManage from './friendRequestManage';

const Stack = createNativeStackNavigator();
function FriendsSection() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="FriendsMain" component={MainFriendPage} options={{ headerShown: false }}/>
        <Stack.Screen name="FriendRequestManage" component={FriendRequestManage} options={{ headerShown: false }}/>
      </Stack.Navigator>
  )
}

export default FriendsSection

