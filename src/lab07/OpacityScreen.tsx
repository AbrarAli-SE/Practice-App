import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const OpacityScreen = () => {
    const [isVisible, setIsVisible] = useState(true);
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const toggleOpacity = () => {
        const newOpacity = isVisible ? 0.3 : 1.0;
        setIsVisible(!isVisible);

        Animated.timing(opacityAnim, {
            toValue: newOpacity,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tap to Toggle Opacity</Text>

            <Animated.View
                style={[
                    styles.box,
                    {
                        opacity: opacityAnim,
                    },
                ]}
            >
                <TouchableOpacity onPress={toggleOpacity} style={styles.button}>
                    <Text style={styles.buttonText}>Tap to Fade</Text>
                </TouchableOpacity>
            </Animated.View>

            <Text style={styles.info}>
                Opacity: {isVisible ? '100% (Visible)' : '30% (Faded)'}
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
        width: 150,
        height: 150,
        backgroundColor: '#FFC107',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
    },
    info: {
        marginTop: 30,
        fontSize: 18,
        color: '#666',
    },
});

export default OpacityScreen;