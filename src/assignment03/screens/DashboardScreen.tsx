// src/assignment03/screens/DashboardScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import DeviceCard from '../components/DeviceCard';
import AddDeviceModal from '../components/AddDeviceModal';

// --- INLINED TYPES and THEME ---
type DeviceType = 'light' | 'fan' | 'ac' | 'camera';
interface Device {
    id: number;
    name: string;
    room: string;
    type: DeviceType;
    isOn: boolean;
    value?: number;
}
type DashboardScreenProps = {
    navigation: {
        navigate: (screen: 'Details', params: {
            deviceData: Device;
            onUpdateValue: (id: number, value: number) => void;
            onToggle: (id: number, isOn: boolean) => void;
        }) => void;
    };
};
const COLORS = {
    primary: '#4F46E5',
    background: '#F9FAFB',
    text: '#1F2937',
};
const SPACING = {
    small: 8,
    medium: 16,
    large: 24,
};

// --- Component ---
const INITIAL_DEVICES: Device[] = [
    { id: 1, name: 'Living Room Light', room: 'Living Room', type: 'light', isOn: true, value: 75 },
    { id: 2, name: 'Bedroom Fan', room: 'Bedroom', type: 'fan', isOn: false, value: 50 },
    { id: 3, name: 'Kitchen AC', room: 'Kitchen', type: 'ac', isOn: true, value: 22 },
    { id: 4, name: 'Front Door Cam', room: 'Entrance', type: 'camera', isOn: true },
];

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
    const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleToggle = (id: number, isOn: boolean) => {
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id ? { ...device, isOn } : device
            )
        );
    };

    const updateDeviceValue = (id: number, value: number) => {
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === id ? { ...device, value: Math.round(value) } : device
            )
        );
    };

    const handleAddDevice = (newDeviceData: Omit<Device, 'id' | 'isOn' | 'value'>) => {
        const newDevice: Device = {
            ...newDeviceData,
            id: Date.now(),
            isOn: false,
            value: newDeviceData.type === 'light' || newDeviceData.type === 'fan' ? 50 : 20,
        };
        setDevices(prevDevices => [...prevDevices, newDevice]);
    };

    // ADDED: Function to remove the device
    const handleRemoveDevice = (id: number) => {
        setDevices(prevDevices => prevDevices.filter(device => device.id !== id));
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={devices}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <DeviceCard
                        device={item}
                        onToggle={(isOn) => handleToggle(item.id, isOn)}
                        onRemove={() => handleRemoveDevice(item.id)} // ADDED: Pass remove function
                        onPress={() => navigation.navigate('Details', {
                            deviceData: item,
                            onUpdateValue: updateDeviceValue,
                            onToggle: handleToggle,
                        })}
                    />
                )}
                numColumns={2}
                contentContainerStyle={styles.grid}
            />

            <AddDeviceModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onAddDevice={handleAddDevice}
            />

            {/* FAB: show plus sign via Text to avoid icon font issues */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    grid: {
        padding: SPACING.small,
        paddingBottom: 100,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    fabText: {
        color: '#FFF',
        fontSize: 28,
        lineHeight: 32,
        fontWeight: '700',
    },
});

export default DashboardScreen;