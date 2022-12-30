import React, {Component} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from "./Login";
import HomeIndex from "./HomeIndex";
import Main from "./Main";
import NewSpend from "./NewSpend";
import NewSheet from "./NewSheet";
import EditSpend from "./EditSpend";


const Stack = createStackNavigator();

export default function MainIndex() {
  return (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
          >
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HomeIndex" component={HomeIndex} />
            <Stack.Screen name="NewSpend" component={NewSpend} />
            <Stack.Screen name="NewSheet" component={NewSheet} />
            <Stack.Screen name="EditSpend" component={EditSpend} />
        </Stack.Navigator>
    </NavigationContainer>
    
  );
}
