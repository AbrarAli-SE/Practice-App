import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const CrossFadeScreen = () => {
    const [showFirst, setShowFirst] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const crossFade = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowFirst(!showFirst);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tap to Cross Fade</Text>

            <TouchableOpacity onPress={crossFade} activeOpacity={0.8}>
                <Animated.View
                    style={[
                        styles.box,
                        {
                            backgroundColor: showFirst ? '#FFC107' : '#CDDC39',
                            width: showFirst ? 100 : 200,
                            height: showFirst ? 100 : 200,
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Text style={styles.boxText}>
                        {showFirst ? 'First Box\n100x100' : 'Second Box\n200x200'}
                    </Text>
                </Animated.View>
            </TouchableOpacity>

            <Text style={styles.info}>
                Showing: {showFirst ? 'Yellow (Small)' : 'Lime (Large)'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    boxText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    info: {
        marginTop: 30,
        fontSize: 18,
        color: '#666',
    },
});

export default CrossFadeScreen;