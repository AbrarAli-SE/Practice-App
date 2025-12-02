// src/assignment04/SmartTrackerNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddLogScreen from './screens/AddLogScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';
import { COLORS } from './types';

export type SmartTrackerParamList = {
    Home: undefined;
    AddLog: undefined;
    ActivityDetail: { activity: string }; // JSON stringified activity
};

const Stack = createNativeStackNavigator<SmartTrackerParamList>();

const SmartTrackerNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.white,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: '📍 SmartTracker', headerShown: false }}
            />
            <Stack.Screen
                name="AddLog"
                component={AddLogScreen}
                options={{ title: 'New Activity' }}
            />
            <Stack.Screen
                name="ActivityDetail"
                component={ActivityDetailScreen}
                options={{ title: 'Activity Details' }}
            />
        </Stack.Navigator>
    );
};

export default SmartTrackerNavigator;