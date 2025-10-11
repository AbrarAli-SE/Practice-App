import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const AnimatedBoxScreen = () => {
    const [width, setWidth] = useState(100);
    const animatedWidth = useRef(new Animated.Value(100)).current;

    const increaseWidth = () => {
        const newWidth = width >= 320 ? 100 : width + 50;
        setWidth(newWidth);

        Animated.timing(animatedWidth, {
            toValue: newWidth,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tap to Grow Width</Text>

            <Animated.View
                style={[
                    styles.box,
                    {
                        width: animatedWidth,
                    },
                ]}
            >
                <TouchableOpacity onPress={increaseWidth} style={styles.button}>
                    <Text style={styles.buttonText}>Tap to{'\n'}Grow Width{'\n'}{width}px</Text>
                </TouchableOpacity>
            </Animated.View>

            <Text style={styles.info}>Current Width: {width}px</Text>
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
        height: 100,
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
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    info: {
        marginTop: 20,
        fontSize: 18,
        color: '#666',
    },
});

export default AnimatedBoxScreen;