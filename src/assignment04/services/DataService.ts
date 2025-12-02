// src/assignment04/services/DataService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../types';

const STORAGE_KEY = '@smarttracker_activities';
const OFFLINE_KEY = '@smarttracker_offline';
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const MAX_OFFLINE = 5;

class DataService {
    // ========== LOCAL STORAGE ==========

    async getActivities(): Promise<Activity[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Get activities error:', error);
            return [];
        }
    }

    async saveActivities(activities: Activity[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
            // Update offline cache (last 5)
            const offlineData = activities.slice(0, MAX_OFFLINE);
            await AsyncStorage.setItem(OFFLINE_KEY, JSON.stringify(offlineData));
        } catch (error) {
            console.error('Save activities error:', error);
        }
    }

    async addActivity(activity: Activity): Promise<Activity[]> {
        const activities = await this.getActivities();
        const updated = [activity, ...activities];
        await this.saveActivities(updated);
        return updated;
    }

    async updateActivity(activity: Activity): Promise<Activity[]> {
        const activities = await this.getActivities();
        const updated = activities.map(a => a.id === activity.id ? activity : a);
        await this.saveActivities(updated);
        return updated;
    }

    async deleteActivity(id: string): Promise<Activity[]> {
        const activities = await this.getActivities();
        const updated = activities.filter(a => a.id !== id);
        await this.saveActivities(updated);
        return updated;
    }

    async getOfflineActivities(): Promise<Activity[]> {
        try {
            const data = await AsyncStorage.getItem(OFFLINE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            return [];
        }
    }

    // ========== API OPERATIONS ==========

    async syncToServer(activity: Activity): Promise<boolean> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: activity.title,
                    body: activity.description,
                    userId: 1,
                }),
            });

            if (response.ok) {
                // Mark as synced locally
                const updated = { ...activity, isSynced: true };
                await this.updateActivity(updated);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Sync failed - offline mode:', error);
            return false;
        }
    }

    async syncAllPending(): Promise<number> {
        const activities = await this.getActivities();
        const pending = activities.filter(a => !a.isSynced);
        let syncedCount = 0;

        for (const activity of pending) {
            const success = await this.syncToServer(activity);
            if (success) syncedCount++;
        }

        return syncedCount;
    }

    async checkConnection(): Promise<boolean> {
        try {
            const response = await fetch(API_URL + '/1', { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // ========== GEOCODING ==========

    async getAddress(lat: number, lng: number): Promise<string> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data.display_name) {
                return data.display_name.split(',').slice(0, 3).join(',');
            }
        } catch (error) {
            console.log('Geocoding failed');
        }
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

export const dataService = new DataService();