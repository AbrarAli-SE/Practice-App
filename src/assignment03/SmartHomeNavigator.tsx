import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import DashboardScreen from './screens/DashboardScreen';
import DetailsScreen from './screens/DetailsScreen';
import { Image, TouchableOpacity } from 'react-native';

// Minimal navigator param list for type-safety
type RootStackParamList = {
    Dashboard: undefined;
    Details: {
        deviceData: any;
        onUpdateValue: (id: number, value: number) => void;
        onToggle?: (id: number, isOn: boolean) => void;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SmartHomeNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#1F2937',
                headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
            }}>
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    title: 'Smart Home Dashboard',
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: 8, marginRight: 12 }}>
                            <Icon name="menu" size={22} color="#1F2937" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 12 }}>
                            <Image
                                // correct relative path from this file to project assets folder
                                source={require('../../assets/images/profile.jpg')}
                                style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#4F46E5' }}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={({ route }) => ({
                    title: route?.params?.deviceData?.name ?? 'Details',
                    headerBackTitle: 'Back',
                })}
            />
        </Stack.Navigator>
    );
};

export default SmartHomeNavigator;