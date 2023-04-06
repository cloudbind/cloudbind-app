import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GroupManage from './groupManage';
import ViewGroup from './viewGroup';

const Stack = createNativeStackNavigator();
function GroupSection() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="GroupMain" component={GroupManage} options={{ headerShown: false }}/>
        <Stack.Screen name="ViewGroup" component={ViewGroup} options={{ headerShown: false }}/>
      </Stack.Navigator>
  )
}

export default GroupSection

