import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
type DeviceType = 'light' | 'fan' | 'ac' | 'camera';
interface Device {
    id: number;
    name: string;
    room: string;
    type: DeviceType;
    isOn: boolean;
    value?: number;
}
interface AddDeviceModalProps {
    visible: boolean;
    onClose: () => void;
    onAddDevice: (device: Omit<Device, 'id' | 'isOn' | 'value'>) => void;
}
const COLORS = {
    primary: '#4F46E5',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    accent: '#10B981',
};
const SPACING = {
    small: 8,
    medium: 16,
    large: 24,
};
const deviceTypesList: { label: string, value: DeviceType }[] = [
    { label: '💡 Light', value: 'light' },
    { label: '🌪️ Fan', value: 'fan' },
    { label: '❄️ A/C', value: 'ac' },
    { label: '📹 Camera', value: 'camera' },
];

// --- Component ---

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ visible, onClose, onAddDevice }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [type, setType] = useState<DeviceType>('light'); // Default to light

    const handleAdd = () => {
        if (!name.trim() || !room.trim()) {
            Alert.alert('Validation Error', 'Please fill in all fields.');
            return;
        }
        onAddDevice({ name, room, type });
        setName('');
        setRoom('');
        setType('light');
        onClose();
    };

    const TypeSelector: React.FC = () => (
        <View style={typeStyles.selectorContainer}>
            <Text style={typeStyles.selectorLabel}>Device Type:</Text>
            <View style={typeStyles.buttonRow}>
                {deviceTypesList.map((dt) => (
                    <TouchableOpacity
                        key={dt.value}
                        style={[
                            typeStyles.typeButton,
                            type === dt.value && typeStyles.typeButtonSelected,
                        ]}
                        onPress={() => setType(dt.value)}
                    >
                        <Text
                            style={[
                                typeStyles.typeButtonText,
                                type === dt.value && typeStyles.typeButtonTextSelected
                            ]}
                        >
                            {dt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Add New Device</Text>
                    <TextInput
                        placeholder="Device Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor={COLORS.textSecondary}
                    />
                    <TextInput
                        placeholder="Room Name"
                        value={room}
                        onChangeText={setRoom}
                        style={styles.input}
                        placeholderTextColor={COLORS.textSecondary}
                    />

                    <TypeSelector />

                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={onClose} color={COLORS.textSecondary} />
                        <Button title="Add Device" onPress={handleAdd} color={COLORS.primary} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const typeStyles = StyleSheet.create({
    selectorContainer: {
        marginBottom: SPACING.medium,
    },
    selectorLabel: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: SPACING.small,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    typeButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minWidth: '22%',
        alignItems: 'center',
        marginBottom: SPACING.small,
    },
    typeButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeButtonText: {
        fontSize: 14,
        color: COLORS.text,
    },
    typeButtonTextSelected: {
        color: COLORS.card,
        fontWeight: 'bold',
    },
});

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: SPACING.large,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: SPACING.medium,
        color: COLORS.text,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 14,
        borderRadius: 8,
        marginBottom: SPACING.medium,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: '#F9FAFB',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SPACING.medium,
    },
});

export default AddDeviceModal;