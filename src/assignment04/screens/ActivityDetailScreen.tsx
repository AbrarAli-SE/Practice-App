// src/assignment04/screens/ActivityDetailScreen.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SmartTrackerParamList } from '../SmartTrackerNavigator';
import { dataService } from '../services/DataService';
import { Activity, ActivityCategory, CATEGORY_CONFIG, COLORS } from '../types';

type Props = NativeStackScreenProps<SmartTrackerParamList, 'ActivityDetail'>;

const CATEGORIES: ActivityCategory[] = ['work', 'personal', 'travel', 'health', 'education', 'other'];

const ActivityDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    // Parse activity from route params
    let activity: Activity;

    try {
        activity = JSON.parse(route.params.activity);
    } catch (error) {
        console.error('Failed to parse activity:', error);
        Alert.alert('Error', 'Failed to load activity details', [
            { text: 'Go Back', onPress: () => navigation.goBack() }
        ]);
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load activity</Text>
            </View>
        );
    }

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(activity.title);
    const [description, setDescription] = useState(activity.description);
    const [category, setCategory] = useState<ActivityCategory>(activity.category);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const categoryConfig = CATEGORY_CONFIG[category];

    // Format date nicely
    const formatDate = (timestamp: string): string => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return timestamp;
        }
    };

    const formatTime = (timestamp: string): string => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return '';
        }
    };

    // Handle save
    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Required', 'Title cannot be empty');
            return;
        }

        setIsSaving(true);

        try {
            const updatedActivity: Activity = {
                ...activity,
                title: title.trim(),
                description: description.trim(),
                category: category,
                isSynced: false, // Mark for re-sync
            };

            await dataService.updateActivity(updatedActivity);

            // Try to sync
            dataService.syncToServer(updatedActivity).catch(console.log);

            setIsEditing(false);
            Alert.alert('Success ✅', 'Activity updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Failed to update activity');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle delete
    const handleDelete = () => {
        Alert.alert(
            'Delete Activity',
            'Are you sure you want to delete this activity? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await dataService.deleteActivity(activity.id);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete activity');
                            setIsDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    // Cancel editing
    const handleCancel = () => {
        setTitle(activity.title);
        setDescription(activity.description);
        setCategory(activity.category);
        setIsEditing(false);
    };

    if (isDeleting) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.error} />
                <Text style={styles.loadingText}>Deleting...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: activity.imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Sync Status Badge */}
                <View
                    style={[
                        styles.syncBadge,
                        { backgroundColor: activity.isSynced ? COLORS.success : COLORS.warning },
                    ]}
                >
                    <Text style={styles.syncBadgeText}>
                        {activity.isSynced ? '☁️ Synced' : '⏳ Pending'}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Category */}
                {isEditing ? (
                    <View style={styles.editSection}>
                        <Text style={styles.editLabel}>Category</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScroll}
                        >
                            {CATEGORIES.map((cat) => {
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
                    </View>
                ) : (
                    <View
                        style={[
                            styles.categoryBadge,
                            { backgroundColor: categoryConfig.color + '20' },
                        ]}
                    >
                        <Text style={styles.categoryIcon}>{categoryConfig.icon}</Text>
                        <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
                            {categoryConfig.label}
                        </Text>
                    </View>
                )}

                {/* Title */}
                {isEditing ? (
                    <View style={styles.editSection}>
                        <Text style={styles.editLabel}>Title</Text>
                        <TextInput
                            style={styles.titleInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Activity title"
                            placeholderTextColor={COLORS.gray400}
                            maxLength={100}
                        />
                    </View>
                ) : (
                    <Text style={styles.title}>{title}</Text>
                )}

                {/* Description */}
                {isEditing ? (
                    <View style={styles.editSection}>
                        <Text style={styles.editLabel}>Description</Text>
                        <TextInput
                            style={styles.descriptionInput}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Add description..."
                            placeholderTextColor={COLORS.gray400}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={500}
                        />
                    </View>
                ) : description ? (
                    <Text style={styles.description}>{description}</Text>
                ) : (
                    <Text style={styles.noDescription}>No description added</Text>
                )}

                {/* Info Cards */}
                <View style={styles.infoSection}>
                    {/* Date & Time */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>📅</Text>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Date & Time</Text>
                            <Text style={styles.infoValue}>{formatDate(activity.timestamp)}</Text>
                            <Text style={styles.infoSubvalue}>{formatTime(activity.timestamp)}</Text>
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Location</Text>
                            <Text style={styles.infoValue}>{activity.address}</Text>
                            <Text style={styles.infoSubvalue}>
                                {activity.latitude.toFixed(6)}, {activity.longitude.toFixed(6)}
                            </Text>
                        </View>
                    </View>

                    {/* Activity ID */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>🆔</Text>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Activity ID</Text>
                            <Text style={styles.infoValueSmall} numberOfLines={1}>
                                {activity.id}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>✕ Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.saveButton]}
                                onPress={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color={COLORS.white} size="small" />
                                ) : (
                                    <Text style={styles.saveButtonText}>💾 Save</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => setIsEditing(true)}
                            >
                                <Text style={styles.editButtonText}>✏️ Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={handleDelete}
                            >
                                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray50,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.error,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray50,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.gray600,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 280,
        backgroundColor: COLORS.gray200,
    },
    syncBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    syncBadgeText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    categoryScroll: {
        marginTop: 8,
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
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.gray900,
        marginBottom: 12,
        lineHeight: 36,
    },
    description: {
        fontSize: 16,
        color: COLORS.gray600,
        lineHeight: 26,
        marginBottom: 24,
    },
    noDescription: {
        fontSize: 16,
        color: COLORS.gray400,
        fontStyle: 'italic',
        marginBottom: 24,
    },
    editSection: {
        marginBottom: 20,
    },
    editLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray700,
        marginBottom: 8,
    },
    titleInput: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.gray800,
        borderWidth: 1.5,
        borderColor: COLORS.gray200,
    },
    descriptionInput: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: COLORS.gray800,
        borderWidth: 1.5,
        borderColor: COLORS.gray200,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    infoSection: {
        gap: 12,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.gray200,
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 14,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.gray500,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray800,
    },
    infoSubvalue: {
        fontSize: 13,
        color: COLORS.gray500,
        marginTop: 2,
    },
    infoValueSmall: {
        fontSize: 14,
        color: COLORS.gray600,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 32,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: COLORS.primary,
    },
    editButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    deleteButton: {
        backgroundColor: '#FEE2E2',
    },
    deleteButtonText: {
        color: COLORS.error,
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        backgroundColor: COLORS.gray200,
    },
    cancelButtonText: {
        color: COLORS.gray700,
        fontSize: 16,
        fontWeight: '700',
    },
    saveButton: {
        backgroundColor: COLORS.success,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ActivityDetailScreen;