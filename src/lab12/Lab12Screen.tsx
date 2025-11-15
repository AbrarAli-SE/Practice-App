import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    NativeModules,
    Platform,
    ActivityIndicator,
    Alert,
    TextInput,
    TouchableOpacity, // Use this for custom buttons
    ScrollView, // Use this for a robust layout
} from 'react-native';

// --- Native Module ---
const { DeviceInfoModule } = NativeModules;

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    style?: object;
    textStyle?: object;
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    isLoading = false,
    style = {},
    textStyle = {},
    disabled = false,
}) => {
    const isDisabled = isLoading || disabled;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.buttonBase,
                style,
                isDisabled && styles.buttonDisabled,
            ]}>
            {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
            ) : (
                <Text style={[styles.buttonTextBase, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

// --- Main Screen Component ---
const Lab12Screen = () => {
    // We can use a single loading state to track which action is active
    const [loading, setLoading] = useState<
        'info' | 'battery' | 'vibrate' | 'toast' | null
    >(null);

    const [deviceInfo, setDeviceInfo] = useState<string | null>(null);
    const [batteryLevel, setBatteryLevel] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState('Hello from React Native!');

    // --- Handlers ---
    const handleFetchInfo = async () => {
        setLoading('info');
        try {
            if (!DeviceInfoModule) {
                throw new Error('Native Module "DeviceInfoModule" not found.');
            }
            const info: string = await DeviceInfoModule.getDeviceInfo();
            setDeviceInfo(info);
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', e.message);
        } finally {
            setLoading(null);
        }
    };

    const handleVibrate = async () => {
        setLoading('vibrate');
        try {
            if (!DeviceInfoModule || !DeviceInfoModule.vibrate) {
                throw new Error('Native "vibrate" method not found.');
            }
            await DeviceInfoModule.vibrate();
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', e.message);
        } finally {
            setTimeout(() => setLoading(null), 300); // Give feedback
        }
    };

    const handleGetBattery = async () => {
        setLoading('battery');
        try {
            if (!DeviceInfoModule || !DeviceInfoModule.getBatteryLevel) {
                throw new Error('Native "getBatteryLevel" method not found.');
            }
            const battery: string = await DeviceInfoModule.getBatteryLevel();
            setBatteryLevel(battery);
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', e.message);
        } finally {
            setLoading(null);
        }
    };

    const handleShowToast = () => {
        if (!toastMessage.trim()) {
            Alert.alert('Error', 'Please enter a message for the toast.');
            return;
        }
        setLoading('toast');
        try {
            if (!DeviceInfoModule || !DeviceInfoModule.showNativeToast) {
                throw new Error('Native "showNativeToast" method not found.');
            }
            DeviceInfoModule.showNativeToast(toastMessage);
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', e.message);
        } finally {
            setTimeout(() => setLoading(null), 300); // Give feedback
        }
    };

    // --- Render ---
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Lab 12: Native Modules</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* --- Content Cards --- */}
                <View style={styles.contentContainer}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Device Info ({Platform.OS})</Text>
                        {loading === 'info' ? (
                            <ActivityIndicator size="small" color="#007bff" />
                        ) : deviceInfo ? (
                            <Text style={styles.infoText}>{deviceInfo}</Text>
                        ) : (
                            <Text style={styles.infoTextPlaceholder}>
                                Press the button below to load device info.
                            </Text>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.title}>Battery Level</Text>
                        {loading === 'battery' ? (
                            <ActivityIndicator size="small" color="#28a745" />
                        ) : batteryLevel ? (
                            <Text style={styles.infoText}>{batteryLevel}</Text>
                        ) : (
                            <Text style={styles.infoTextPlaceholder}>
                                Press the button below to load battery level.
                            </Text>
                        )}
                    </View>
                </View>

                {/* --- Action Buttons --- */}
                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Get Device Info"
                        onPress={handleFetchInfo}
                        isLoading={loading === 'info'}
                        style={styles.buttonPrimary}
                        textStyle={styles.buttonTextLight}
                    />
                    <CustomButton
                        title="Get Battery Level"
                        onPress={handleGetBattery}
                        isLoading={loading === 'battery'}
                        style={styles.buttonSuccess}
                        textStyle={styles.buttonTextLight}
                    />
                    <CustomButton
                        title="Vibrate Device"
                        onPress={handleVibrate}
                        isLoading={loading === 'vibrate'}
                        style={styles.buttonDanger}
                        textStyle={styles.buttonTextLight}
                    />

                    <View style={styles.toastContainer}>
                        <Text style={styles.inputLabel}>Toast Message:</Text>
                        <TextInput
                            style={styles.input}
                            value={toastMessage}
                            onChangeText={setToastMessage}
                            placeholder="Enter message..."
                        />
                        <CustomButton
                            title="Show Native Toast"
                            onPress={handleShowToast}
                            isLoading={loading === 'toast'}
                            style={styles.buttonSpecial}
                            textStyle={styles.buttonTextLight}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7f6',
    },
    headerContainer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a252f',
        textAlign: 'center',
    },
    scrollContainer: {
        padding: 20,
    },
    contentContainer: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a252f',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#4a5568',
        lineHeight: 20,
    },
    infoTextPlaceholder: {
        fontSize: 14,
        color: '#a0aec0',
        fontStyle: 'italic',
    },
    buttonContainer: {
        width: '100%',
    },
    buttonBase: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 12,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonTextBase: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextLight: {
        color: '#ffffff',
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
    },
    buttonSuccess: {
        backgroundColor: '#28a745',
    },
    buttonDanger: {
        backgroundColor: '#dc3545',
    },
    buttonSpecial: {
        backgroundColor: '#6a0dad',
    },
    toastContainer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#4a5568',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#ffffff',
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        fontSize: 16,
    },
});

export default Lab12Screen;