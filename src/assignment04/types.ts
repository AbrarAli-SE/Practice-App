// src/assignment04/types.ts

export interface Activity {
    id: string;
    title: string;
    description: string;
    timestamp: string; 
    latitude: number;
    longitude: number;
    address: string;
    imageUri: string;
    category: ActivityCategory;
    isSynced: boolean;
}

export type ActivityCategory = 'work' | 'personal' | 'travel' | 'health' | 'education' | 'other';

export const CATEGORY_CONFIG: Record<ActivityCategory, { icon: string; label: string; color: string }> = {
    work: { icon: '💼', label: 'Work', color: '#3B82F6' },
    personal: { icon: '👤', label: 'Personal', color: '#8B5CF6' },
    travel: { icon: '✈️', label: 'Travel', color: '#F59E0B' },
    health: { icon: '❤️', label: 'Health', color: '#22C55E' },
    education: { icon: '📚', label: 'Education', color: '#EC4899' },
    other: { icon: '📌', label: 'Other', color: '#6B7280' },
};

export const COLORS = {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
};