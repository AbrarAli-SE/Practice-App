import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedBoxScreen from './AnimatedBoxScreen';
import CrossFadeScreen from './CrossFadeScreen';
import OpacityScreen from './OpacityScreen';
import BalloonScreen from './BalloonScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
                    fontWeight: '600',
                    bottom: 20,
                },
            }}
        >
            <Tab.Screen
                name="AnimatedBox"
                component={AnimatedBoxScreen}
                options={{
                    title: 'Animated Box',
                    tabBarLabel: 'Box',
                }}
            />
            <Tab.Screen
                name="CrossFade"
                component={CrossFadeScreen}
                options={{
                    title: 'Cross Fade',
                    tabBarLabel: 'Fade',
                }}
            />
            <Tab.Screen
                name="Opacity"
                component={OpacityScreen}
                options={{
                    title: 'Opacity Animation',
                    tabBarLabel: 'Opacity',
                }}
            />
            <Tab.Screen
                name="Balloon"
                component={BalloonScreen}
                options={{
                    title: 'Balloon Animation',
                    tabBarLabel: 'Balloon',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;