import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import lab5 from './src/lab05/lab5';
import BottomTabNavigator from './src/assignment02/BottomTabNavigation';
import Practice from './src/assignment01/practice';
import lab6 from './src/lab06/lab6';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* <Stack.Screen name="BottomTabs" component={BottomTabNavigator} /> */}

        {/* <Stack.Screen name="Practice" component={Practice}/> */}

        {/* <Stack.Screen name="Lab5" component={lab5} /> */}

        <Stack.Screen name="Lab6" component={lab6} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
