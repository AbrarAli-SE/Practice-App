import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ListScreen from './ListScreen';
import AboutScreen from './AboutScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#4A90E2',
                    elevation: 4,
                    shadowOpacity: 0.3,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                },
                tabBarActiveTintColor: '#4A90E2',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderTopColor: '#E5E5EA',
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    bottom: 20,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Travel Guide',
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="List"
                component={ListScreen}
                options={{
                    title: 'Travel Guide',
                    tabBarLabel: 'Destinations',
                }}
            />
            <Tab.Screen
                name="About"
                component={AboutScreen}
                options={{
                    title: 'Travel Guide',
                    tabBarLabel: 'Landmarks',
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;