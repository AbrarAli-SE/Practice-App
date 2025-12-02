import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Platform,
    PermissionsAndroid,
    Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SmartTrackerParamList } from '../SmartTrackerNavigator';
import { dataService } from '../services/DataService';
import { Activity, ActivityCategory, CATEGORY_CONFIG, COLORS } from '../types';

// Safe imports with try-catch
let MapView: any = null;
let Marker: any = null;
let Geolocation: any = null;
let launchCamera: any = null;

try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
} catch (e) {
    console.log('react-native-maps not available:', e);
}

try {
    Geolocation = require('react-native-geolocation-service').default;
} catch (e) {
    console.log('react-native-geolocation-service not available:', e);
}

try {
    const imagePicker = require('react-native-image-picker');
    launchCamera = imagePicker.launchCamera;
} catch (e) {
    console.log('react-native-image-picker not available:', e);
}

type Props = NativeStackScreenProps<SmartTrackerParamList, 'AddLog'>;

const CATEGORIES: ActivityCategory[] = ['work', 'personal', 'travel', 'health', 'education', 'other'];

const AddLogScreen: React.FC<Props> = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ActivityCategory>('other');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [address, setAddress] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);


    useEffect(() => {
        requestPermissionsAndGetLocation();
    }, []);

    const requestPermissionsAndGetLocation = async () => {
        // TEMPORARY FIX: Skip permission request and go straight to mock location
        // This avoids the native module crash
        console.log('Skipping permissions, using mock location');
        getLocation();
    };

    const getLocation = () => {
        // TEMPORARY FIX: Skip geolocation library entirely
        // Using mock data to bypass the native module crash
        console.log('Using mock location to avoid native module crash');
        setIsLoadingLocation(true);

        // Simulate loading
        setTimeout(() => {
            const mockLocations = [
                { lat: 33.6844, lng: 73.0479, addr: 'Islamabad, Pakistan' },
                { lat: 31.5204, lng: 74.3587, addr: 'Lahore, Pakistan' },
                { lat: 24.8607, lng: 67.0011, addr: 'Karachi, Pakistan' },
            ];

            const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

            setLatitude(randomLocation.lat);
            setLongitude(randomLocation.lng);
            setAddress(randomLocation.addr);
            setLocationError(null);
            setIsLoadingLocation(false);
        }, 1000);
    };

    const handleTakePhoto = async () => {
        if (!launchCamera) {
            console.log('Camera not available, using placeholder');
            // Use placeholder image for testing
            setImageUri('https://via.placeholder.com/400x300.png?text=Activity+Photo');
            return;
        }

        try {
            // Request camera permission first
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                if (granted !== 'granted') {
                    Alert.alert('Permission Denied', 'Camera permission is required');
                    return;
                }
            }

            const result = await launchCamera({
                mediaType: 'photo',
                quality: 0.7,
                saveToPhotos: true,
                cameraType: 'back',
            });

            console.log('Camera result:', result);

            if (result.didCancel) {
                console.log('User cancelled camera');
                return;
            }

            if (result.errorCode) {
                console.log('Camera error:', result.errorMessage);
                Alert.alert('Camera Error', result.errorMessage || 'Failed to capture photo');
                return;
            }

            if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Failed to open camera');
        }
    };

    const handleSave = async () => {
        // Validation
        if (!title.trim()) {
            Alert.alert('Required', 'Please enter activity title');
            return;
        }
        if (latitude === null || longitude === null) {
            Alert.alert('Required', 'Location is required. Please wait or use mock location.');
            return;
        }
        if (!imageUri) {
            Alert.alert('Required', 'Please capture a photo');
            return;
        }

        setIsSaving(true);
        try {
            const now = new Date().toISOString();
            const newActivity: Activity = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: title.trim(),
                description: description.trim(),
                timestamp: now,
                latitude,
                longitude,
                address,
                imageUri,
                category,
                isSynced: false,
            };

            console.log('Saving activity:', newActivity);

            // Save locally
            await dataService.addActivity(newActivity);

            // Try to sync (don't block on failure)
            dataService.syncToServer(newActivity).catch(e => console.log('Sync failed:', e));

            Alert.alert('Success', 'Activity saved!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save activity');
        } finally {
            setIsSaving(false);
        }
    };

    // Mock location for testing
    const useMockLocation = () => {
        setLatitude(33.6844);
        setLongitude(73.0479);
        setAddress('Islamabad, Pakistan (Mock)');
        setLocationError(null);
        setIsLoadingLocation(false);
    };

    // Mock image for testing
    const useMockImage = () => {
        setImageUri('https://via.placeholder.com/400x300.png?text=Activity+Photo');
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {/* Title */}
            <Text style={styles.label}>Activity Title *</Text>
            <TextInput
                style={styles.input}
                placeholder="What did you do?"
                placeholderTextColor={COLORS.gray400}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add some details..."
                placeholderTextColor={COLORS.gray400}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={500}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
            >
                {CATEGORIES.map(cat => {
                    const config = CATEGORY_CONFIG[cat];
                    const isSelected = category === cat;
                    return (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                isSelected && { backgroundColor: config.color },
                            ]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={styles.categoryChipIcon}>{config.icon}</Text>
                            <Text
                                style={[
                                    styles.categoryChipText,
                                    isSelected && { color: COLORS.white },
                                ]}
                            >
                                {config.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Location */}
            <View style={styles.locationHeader}>
                <Text style={styles.label}>Location *</Text>
                <View style={styles.locationButtons}>
                    <TouchableOpacity onPress={getLocation} disabled={isLoadingLocation}>
                        <Text style={styles.refreshBtn}>🔄 Retry</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={useMockLocation}>
                        <Text style={[styles.refreshBtn, { marginLeft: 12 }]}>📍 Mock</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mapContainer}>
                {isLoadingLocation ? (
                    <View style={styles.mapLoading}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.mapLoadingText}>Getting location...</Text>
                    </View>
                ) : latitude && longitude ? (
                    <>
                        {MapView ? (
                            <MapView
                                style={styles.map}
                                region={{
                                    latitude,
                                    longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                liteMode={true} // Use lite mode to prevent crashes
                            >
                                {Marker && (
                                    <Marker coordinate={{ latitude, longitude }} />
                                )}
                            </MapView>
                        ) : (
                            <View style={styles.mapFallback}>
                                <Text style={styles.mapFallbackIcon}>🗺️</Text>
                                <Text style={styles.mapFallbackText}>
                                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                                </Text>
                            </View>
                        )}
                        <View style={styles.addressContainer}>
                            <Text style={styles.addressText}>📍 {address}</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.mapLoading}>
                        <Text style={styles.mapErrorIcon}>📍</Text>
                        <Text style={styles.mapErrorText}>
                            {locationError || 'Location unavailable'}
                        </Text>
                        <TouchableOpacity onPress={useMockLocation}>
                            <Text style={styles.retryBtn}>Use Mock Location</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Camera */}
            <View style={styles.locationHeader}>
                <Text style={styles.label}>Photo Evidence *</Text>
                <TouchableOpacity onPress={useMockImage}>
                    <Text style={styles.refreshBtn}>🖼️ Mock</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cameraContainer} onPress={handleTakePhoto}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.cameraPlaceholder}>
                        <Text style={styles.cameraIcon}>📷</Text>
                        <Text style={styles.cameraText}>Tap to Capture Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            {imageUri && (
                <TouchableOpacity style={styles.retakeBtn} onPress={handleTakePhoto}>
                    <Text style={styles.retakeBtnText}>📷 Retake Photo</Text>
                </TouchableOpacity>
            )}

            {/* Save Button */}
            <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator color={COLORS.white} />
                ) : (
                    <Text style={styles.saveButtonText}>💾 Save Activity</Text>
                )}
            </TouchableOpacity>

            {/* Debug Info */}
            <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>Location: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}</Text>
                <Text style={styles.debugText}>Image: {imageUri ? 'Set' : 'Not set'}</Text>
                <Text style={styles.debugText}>Maps Available: {MapView ? 'Yes' : 'No'}</Text>
                <Text style={styles.debugText}>Camera Available: {launchCamera ? 'Yes' : 'No'}</Text>
                <Text style={styles.debugText}>Geolocation Available: {Geolocation ? 'Yes' : 'No'}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray700,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: COLORS.gray800,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryScroll: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    categoryChipIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.gray700,
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    locationButtons: {
        flexDirection: 'row',
    },
    refreshBtn: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    map: {
        flex: 1,
    },
    mapFallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray100,
    },
    mapFallbackIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    mapFallbackText: {
        fontSize: 14,
        color: COLORS.gray500,
    },
    mapLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray100,
    },
    mapLoadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.gray500,
    },
    mapErrorIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    mapErrorText: {
        fontSize: 14,
        color: COLORS.error,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    retryBtn: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    addressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 10,
    },
    addressText: {
        fontSize: 12,
        color: COLORS.gray700,
    },
    cameraContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        borderStyle: 'dashed',
    },
    cameraPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    cameraText: {
        fontSize: 16,
        color: COLORS.gray500,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    retakeBtn: {
        alignSelf: 'center',
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    retakeBtnText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 32,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonDisabled: {
        backgroundColor: COLORS.gray400,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    debugContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: COLORS.gray100,
        borderRadius: 12,
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.gray700,
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        color: COLORS.gray500,
        marginBottom: 4,
    },
});

export default AddLogScreen;
