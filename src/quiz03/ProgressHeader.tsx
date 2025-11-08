// ProgressHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ProgressHeaderProps } from './types';

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ scrollY, learned, total }) => {
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [120, 80],
        extrapolate: 'clamp',
    });

    const titleSize = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [28, 20],
        extrapolate: 'clamp',
    });

    const progressOpacity = scrollY.interpolate({
        inputRange: [0, 50, 100],
        outputRange: [1, 0.7, 0],
        extrapolate: 'clamp',
    });

    const percentage: number = total > 0 ? (learned / total) * 100 : 0;

    return (
        <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Animated.Text style={[styles.title, { fontSize: titleSize }]}>
                Flashcard Quiz
            </Animated.Text>

            <Animated.View style={[styles.progressContainer, { opacity: progressOpacity }]}>
                <Text style={styles.progressText}>
                    {learned} of {total} learned
                </Text>

                <View style={styles.progressBarBg}>
                    <Animated.View
                        style={[
                            styles.progressBarFill,
                            { width: `${percentage}%` },
                        ]}
                    />
                </View>

                <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 8,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    percentageText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'right',
    },
});

export default ProgressHeader;