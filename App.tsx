import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Practice from './src/assignment01/practice';
import BottomTabNavigator from './src/assignment02/BottomTabNavigation';
import SmartHomeNavigator from './src/assignment03/SmartHomeNavigator';
import SmartTrackerNavigator from './src/assignment04/SmartTrackerNavigator';

import lab5 from './src/lab05/lab5';
import lab6 from './src/lab06/lab6';
import TabNavigator from './src/lab07/TabNavigator';
import Lab12Screen from './src/lab12/Lab12Screen';

import Quiz01 from './src/quiz01/Quiz01';
import Quiz03 from './src/quiz03/Quiz03';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* <Stack.Screen name="BottomTabs" component={BottomTabNavigator} /> */}

        {/* <Stack.Screen name="Practice" component={Practice}/> */}

        {/* <Stack.Screen name="Lab5" component={lab5} /> */}

        {/* <Stack.Screen name="Lab6" component={lab6} /> */}

        {/* <Stack.Screen name="TabNavigator" component={TabNavigator} /> */}

        {/* <Stack.Screen name="Quiz01" component={Quiz01}/> */}

        {/* <Stack.Screen name="Quiz03" component={Quiz03}/> */}

        {/* <Stack.Screen name="Lab12" component={Lab12Screen} /> */}

        {/* <Stack.Screen name="SmartHome" component={SmartHomeNavigator} /> */}

        <Stack.Screen name="SmartTracker" component={SmartTrackerNavigator} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
