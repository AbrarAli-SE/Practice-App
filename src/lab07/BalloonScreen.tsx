import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const MoveBoxScreen = () => {
    const [isUp, setIsUp] = useState(false);
    const positionAnim = useRef(new Animated.Value(0)).current;

    const togglePosition = () => {
        Animated.timing(positionAnim, {
            toValue: isUp ? 0 : -180, 
            duration: 500,
            useNativeDriver: true,
        }).start();
        setIsUp(!isUp);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tap to Move Box</Text>

            <Animated.View
                style={[
                    styles.box,
                    {
                        transform: [{ translateY: positionAnim }],
                    },
                ]}
            />

            <TouchableOpacity onPress={togglePosition} style={styles.button}>
                <Text style={styles.buttonText}>{isUp ? 'Move Down' : 'Move Up'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, marginBottom: 30 },
    box: {
        width: 100,
        height: 100,
        backgroundColor: '#FFC107',
        borderRadius: 10,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MoveBoxScreen;