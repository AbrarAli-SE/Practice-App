// FlashCard.tsx
import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState,
} from 'react-native';
import { FlashCardProps } from './types';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.4;

const FlashCard: React.FC<FlashCardProps> = ({ item, onSwipeLeft, onRemove }) => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const flipAnim = useRef(new Animated.Value(0)).current;
    const swipeAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    // Flip animation
    const handleFlip = (): void => {
        const toValue = isFlipped ? 0 : 1;

        Animated.spring(flipAnim, {
            toValue,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();

        setIsFlipped(!isFlipped);
    };

    // Handle swipe left animation
    const handleSwipeLeft = (): void => {
        setIsRemoving(true);

        Animated.parallel([
            Animated.timing(swipeAnim, {
                toValue: -width,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onSwipeLeft(item.id);
            setTimeout(() => {
                onRemove(item.id);
            }, 100);
        });
    };

    // Pan responder for swipe gesture
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (): boolean => true,
            onMoveShouldSetPanResponder: (
                _: GestureResponderEvent,
                gesture: PanResponderGestureState
            ): boolean => {
                return Math.abs(gesture.dx) > 5;
            },
            onPanResponderMove: (
                _: GestureResponderEvent,
                gesture: PanResponderGestureState
            ): void => {
                swipeAnim.setValue(gesture.dx);
            },
            onPanResponderRelease: (
                _: GestureResponderEvent,
                gesture: PanResponderGestureState
            ): void => {
                if (gesture.dx < -SWIPE_THRESHOLD) {
                    // Swipe left - mark as learned
                    handleSwipeLeft();
                } else {
                    // Return to original position
                    Animated.spring(swipeAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // Interpolations
    const frontRotation = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backRotation = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    const backOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const swipeOpacity = swipeAnim.interpolate({
        inputRange: [-width, -SWIPE_THRESHOLD, 0],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
    });

    const backgroundColor = swipeAnim.interpolate({
        inputRange: [-SWIPE_THRESHOLD, 0],
        outputRange: ['#4CAF50', '#FFFFFF'],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={[
                styles.cardContainer,
                {
                    transform: [{ translateX: swipeAnim }],
                    opacity: Animated.multiply(opacityAnim, swipeOpacity),
                },
            ]}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity
                onPress={handleFlip}
                activeOpacity={0.9}
                disabled={isRemoving}
                style={styles.touchable}
            >
                {/* Front Side */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardFront,
                        {
                            backgroundColor,
                            transform: [{ rotateY: frontRotation }],
                            opacity: frontOpacity,
                        },
                    ]}
                >
                    <Text style={styles.label}>QUESTION</Text>
                    <Text style={styles.questionText}>{item.question}</Text>
                    <Text style={styles.hint}>Tap to reveal answer</Text>
                    <Text style={styles.swipeHint}>← Swipe left if learned</Text>
                </Animated.View>

                {/* Back Side */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardBack,
                        {
                            transform: [{ rotateY: backRotation }],
                            opacity: backOpacity,
                        },
                    ]}
                >
                    <Text style={styles.label}>ANSWER</Text>
                    <Text style={styles.answerText}>{item.answer}</Text>
                    <Text style={styles.hint}>Tap to see question</Text>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        height: 200,
    },
    touchable: {
        flex: 1,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        backfaceVisibility: 'hidden',
    },
    cardFront: {
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    cardBack: {
        backgroundColor: '#6C63FF',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        marginBottom: 12,
        letterSpacing: 1.5,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
    },
    answerText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    hint: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 8,
    },
    swipeHint: {
        position: 'absolute',
        bottom: 16,
        fontSize: 11,
        color: '#FF5722',
        fontWeight: '600',
    },
});

export default FlashCard;