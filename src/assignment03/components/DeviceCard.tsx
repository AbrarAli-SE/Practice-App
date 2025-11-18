import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Dimensions, Alert } from 'react-native';
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
interface DeviceCardProps {
    device: Device;
    onPress: () => void;
    onToggle: (isOn: boolean) => void;
    onRemove: () => void;
}
const COLORS = {
    primary: '#4F46E5',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    icon: '#9CA3AF',
    accent: '#10B981',
    shadow: '#00000089',
    onCardBackground: '#E0F2F1',
};
const SPACING = {
    small: 8,
    medium: 16,
    large: 24,
};
const CARD_WIDTH = Dimensions.get('window').width / 2 - SPACING.large;

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

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, onToggle, onRemove }) => {
    const statusText = device.isOn ? `ON (${device.value ?? 0}%)` : 'OFF';

    const handleLongPress = () => {
        Alert.alert(
            `Remove ${device.name}?`,
            `Are you sure you want to remove this device from the dashboard?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', onPress: onRemove, style: 'destructive' },
            ]
        );
    };

    return (
        <Pressable
            onPress={onPress}
            onLongPress={handleLongPress}
            style={({ pressed }) => [
                styles.card,
                device.isOn && styles.cardOn,
                { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}>
            <View style={styles.headerContainer}>
                <Icon
                    name={getDeviceIcon(device.type)}
                    size={30}
                    color={device.isOn ? COLORS.primary : COLORS.icon}
                />
                <Switch
                    trackColor={{ false: COLORS.icon, true: COLORS.primary }}
                    thumbColor={device.isOn ? COLORS.card : COLORS.card}
                    onValueChange={onToggle}
                    value={device.isOn}
                    style={styles.switch}
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
                <Text style={styles.roomName} numberOfLines={1}>{device.room}</Text>

                {/* FIXED: Bolding using nested Text component */}
                <Text style={[styles.statusText, { color: device.isOn ? COLORS.accent : COLORS.textSecondary }]}>
                    Status: <Text style={{ fontWeight: 'bold' }}>{statusText}</Text>
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: SPACING.medium,
        margin: SPACING.small,
        width: CARD_WIDTH,
        minHeight: 150,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
        justifyContent: 'space-between',
    },
    cardOn: {
        backgroundColor: COLORS.onCardBackground,
        borderColor: COLORS.primary,
        borderWidth: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textContainer: {
        marginTop: SPACING.small,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '900',
        color: COLORS.text,
    },
    roomName: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        alignSelf: 'flex-start',
    },
});

export default DeviceCard;