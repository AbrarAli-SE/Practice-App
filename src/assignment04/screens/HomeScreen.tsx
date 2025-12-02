// src/assignment04/screens/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
    StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SmartTrackerParamList } from '../SmartTrackerNavigator';
import { dataService } from '../services/DataService';
import { Activity, CATEGORY_CONFIG, COLORS } from '../types';

type Props = NativeStackScreenProps<SmartTrackerParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load data
    const loadData = useCallback(async () => {
        setIsLoading(true);
        const data = await dataService.getActivities();
        const online = await dataService.checkConnection();
        setActivities(data);
        setFilteredActivities(data);
        setIsOnline(online);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Refresh on focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation, loadData]);

    // Search filter
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredActivities(activities);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = activities.filter(
                a =>
                    a.title.toLowerCase().includes(query) ||
                    a.description.toLowerCase().includes(query) ||
                    a.address.toLowerCase().includes(query)
            );
            setFilteredActivities(filtered);
        }
    }, [searchQuery, activities]);

    // Delete activity
    const handleDelete = (activity: Activity) => {
        Alert.alert(
            'Delete Activity',
            `Delete "${activity.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const updated = await dataService.deleteActivity(activity.id);
                        setActivities(updated);
                    },
                },
            ]
        );
    };

    // Sync pending
    const handleSync = async () => {
        if (!isOnline) {
            Alert.alert('Offline', 'Please connect to internet to sync.');
            return;
        }

        const pending = activities.filter(a => !a.isSynced).length;
        if (pending === 0) {
            Alert.alert('All Synced', 'No pending activities to sync!');
            return;
        }

        setIsSyncing(true);
        const synced = await dataService.syncAllPending();
        await loadData();
        setIsSyncing(false);
        Alert.alert('Sync Complete', `${synced} activities synced successfully!`);
    };

    // Get relative time
    const getRelativeTime = (timestamp: string): string => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    // Stats
    const totalCount = activities.length;
    const syncedCount = activities.filter(a => a.isSynced).length;
    const pendingCount = totalCount - syncedCount;

    // Render activity card
    const renderActivity = ({ item }: { item: Activity }) => {
        const config = CATEGORY_CONFIG[item.category];

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate('ActivityDetail', { activity: JSON.stringify(item) })
                }
                activeOpacity={0.7}
            >
                {/* Image */}
                <Image source={{ uri: item.imageUri }} style={styles.cardImage} />

                {/* Sync Badge */}
                <View
                    style={[
                        styles.syncBadge,
                        { backgroundColor: item.isSynced ? COLORS.success : COLORS.warning },
                    ]}
                >
                    <Text style={styles.syncBadgeText}>{item.isSynced ? '✓' : '○'}</Text>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    {/* Category */}
                    <View style={[styles.categoryBadge, { backgroundColor: config.color + '20' }]}>
                        <Text style={styles.categoryIcon}>{config.icon}</Text>
                        <Text style={[styles.categoryText, { color: config.color }]}>
                            {config.label}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                    </Text>

                    {/* Description */}
                    {item.description ? (
                        <Text style={styles.cardDescription} numberOfLines={2}>
                            {item.description}
                        </Text>
                    ) : null}

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardLocation} numberOfLines={1}>
                            📍 {item.address}
                        </Text>
                        <Text style={styles.cardTime}>{getRelativeTime(item.timestamp)}</Text>
                    </View>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                >
                    <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerGreeting}>Welcome back! 👋</Text>
                    <Text style={styles.headerTitle}>SmartTracker</Text>
                </View>
                <View
                    style={[
                        styles.onlineBadge,
                        { backgroundColor: isOnline ? '#D1FAE5' : '#FEE2E2' },
                    ]}
                >
                    <View
                        style={[
                            styles.onlineDot,
                            { backgroundColor: isOnline ? COLORS.success : COLORS.error },
                        ]}
                    />
                    <Text
                        style={[
                            styles.onlineText,
                            { color: isOnline ? COLORS.success : COLORS.error },
                        ]}
                    >
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>📊</Text>
                    <Text style={styles.statValue}>{totalCount}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>☁️</Text>
                    <Text style={[styles.statValue, { color: COLORS.success }]}>{syncedCount}</Text>
                    <Text style={styles.statLabel}>Synced</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statIcon}>⏳</Text>
                    <Text style={[styles.statValue, { color: COLORS.warning }]}>{pendingCount}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
            </View>

            {/* Sync Button */}
            {pendingCount > 0 && (
                <TouchableOpacity
                    style={styles.syncButton}
                    onPress={handleSync}
                    disabled={isSyncing}
                >
                    <Text style={styles.syncButtonText}>
                        {isSyncing ? '⏳ Syncing...' : `☁️ Sync ${pendingCount} Activities`}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍 Search activities..."
                    placeholderTextColor={COLORS.gray400}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                        <Text style={styles.clearBtnText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Results Count */}
            <Text style={styles.resultsText}>
                {searchQuery
                    ? `Found ${filteredActivities.length} activities`
                    : 'Recent Activities'}
            </Text>

            {/* Activity List */}
            <FlatList
                data={filteredActivities}
                keyExtractor={item => item.id}
                renderItem={renderActivity}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={loadData}
                        colors={[COLORS.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyTitle}>No Activities Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Tap the + button to start tracking
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddLog')}
                activeOpacity={0.8}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerGreeting: {
        fontSize: 14,
        color: COLORS.gray500,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.gray900,
    },
    onlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    onlineText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.gray500,
        marginTop: 2,
    },
    syncButton: {
        backgroundColor: COLORS.warning,
        marginHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    syncButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.gray800,
    },
    clearBtn: {
        padding: 4,
    },
    clearBtnText: {
        fontSize: 16,
        color: COLORS.gray400,
    },
    resultsText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray700,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    listContent: {
        paddingBottom: 100,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardImage: {
        width: '100%',
        height: 150,
        backgroundColor: COLORS.gray200,
    },
    syncBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    syncBadgeText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 16,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    categoryIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.gray900,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: COLORS.gray500,
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardLocation: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '500',
        flex: 1,
        marginRight: 8,
    },
    cardTime: {
        fontSize: 12,
        color: COLORS.gray400,
    },
    deleteBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    deleteBtnText: {
        fontSize: 16,
        color: COLORS.error,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.gray800,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.gray500,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    fabIcon: {
        fontSize: 32,
        color: COLORS.white,
        fontWeight: '300',
        marginTop: -2,
    },
});

export default HomeScreen;