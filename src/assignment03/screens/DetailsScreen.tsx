// src/assignment03/screens/DetailsScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';

type DeviceType = 'light' | 'fan' | 'ac' | 'camera';
interface Device {
    id: number;
    name: string;
    room: string;
    type: DeviceType;
    isOn: boolean;
    value?: number;
}
const COLORS = {
    primary: '#4F46E5', // Indigo
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    icon: '#9CA3AF',
    accent: '#10B981', // Green
    shadow: 'rgba(0,0,0,0.12)',
};
const SPACING = {
    medium: 16,
    large: 24,
    xLarge: 32,
};
const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Helper Functions ---
const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
        case 'light': return 'lightbulb-o';
        case 'fan': return 'asterisk';
        case 'ac': return 'snowflake-o';
        case 'camera': return 'video-camera';
        default: return 'question-circle';
    }
};

const DetailsScreen = ({ route }: any) => {
    const { deviceData, onUpdateValue, onToggle } = route.params;

    const [isDeviceOn, setIsDeviceOn] = useState(deviceData.isOn);
    const [currentValue, setCurrentValue] = useState(deviceData.value ?? 50);

    const handleMainToggle = (newValue: boolean) => {
        setIsDeviceOn(newValue);
        onToggle(deviceData.id, newValue);
    };

    const handleSliderChange = (value: number) => {
        setCurrentValue(value);
    };

    const handleSlidingComplete = (value: number) => {
        onUpdateValue(deviceData.id, value);
    };

    const renderControl = () => {
        // FIXED: Bolding using nested Text component
        if (!isDeviceOn) {
             return (
                <Text style={styles.noControlsText}>
                    Device is currently <Text style={{fontWeight: 'bold'}}>OFF</Text>.
                </Text>
            );
        }
        
        if (deviceData.type === 'light' || deviceData.type === 'fan') {
            const label = deviceData.type === 'light' ? 'Brightness' : 'Speed';
            return (
                <View style={styles.controlContainer}>
                    {/* FIXED: Bolding using nested Text component */}
                    <Text style={styles.controlLabel}>{label}: <Text style={{fontWeight: 'bold'}}>{Math.round(currentValue)}%</Text></Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={currentValue}
                        onValueChange={handleSliderChange}
                        onSlidingComplete={handleSlidingComplete}
                        minimumTrackTintColor={COLORS.primary}
                        maximumTrackTintColor={COLORS.icon}
                        thumbTintColor={COLORS.primary}
                    />
                </View>
            );
        }
        return <Text style={styles.noControlsText}>No additional controls for this device.</Text>;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={[styles.largeIconContainer, { backgroundColor: isDeviceOn ? COLORS.primary : COLORS.icon }]}>
                    <Icon 
                        name={getDeviceIcon(deviceData.type)} 
                        size={120} 
                        color={COLORS.card} 
                    />
                </View>
                
                <Text style={styles.deviceName}>{deviceData.name}</Text>
                <Text style={styles.deviceRoom}>{deviceData.room}</Text>

                <View style={styles.statusRow}> 
                    <Text style={styles.status}>
                        Status: <Text style={{ color: isDeviceOn ? COLORS.accent : COLORS.textSecondary, fontWeight: 'bold' }}>
                            {isDeviceOn ? 'ON' : 'OFF'}
                        </Text>
                    </Text>
                    <Switch
                        trackColor={{ false: '#9CA3AF', true: COLORS.primary }}
                        thumbColor={COLORS.card}
                        onValueChange={handleMainToggle}
                        value={isDeviceOn}
                    />
                </View>

                {renderControl()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: SPACING.large,
        paddingTop: SPACING.xLarge,
    },
    largeIconContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.large,
        elevation: 10,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    deviceName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.large,
    },
    deviceRoom: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginBottom: SPACING.medium,
    },
    statusRow: { 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SCREEN_WIDTH * 0.85,
        paddingVertical: SPACING.medium,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: SPACING.large,
    },
    status: {
        fontSize: 20,
        color: COLORS.text,
    },
    controlContainer: {
        width: SCREEN_WIDTH * 0.85,
        marginTop: SPACING.large,
        backgroundColor: COLORS.card,
        padding: SPACING.large,
        borderRadius: 12,
        elevation: 3,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    controlLabel: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: SPACING.medium,
        color: COLORS.text,
    },
    slider: {
        width: '100%', 
        height: 40
    },
    noControlsText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.large,
        textAlign: 'center',
    },
});

export default DetailsScreen;