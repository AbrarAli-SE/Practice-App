import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Practice from './src/practice';
import lab5 from './src/lab5';
import BottomTabNavigator from './src/assignment02/BottomTabNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='BottomTabs'>

        <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />

        {/* <Stack.Screen name="Practice" component={Practice}/> */}
        {/* <Stack.Screen name="Lab5" component={lab5} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
