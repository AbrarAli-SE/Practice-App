// Quiz03.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Animated,
    SafeAreaView,
    StatusBar,
    Alert,
    ListRenderItem,
} from 'react-native';
import FlashCard from './FlashCard';
import ProgressHeader from './ProgressHeader';
import { initialFlashcards, getNewRandomCard } from './flashcardData';
import { Flashcard } from './types';

const Quiz03: React.FC = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
    const [learnedCards, setLearnedCards] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList<Flashcard>>(null);

    // Handle swipe left (mark as learned)
    const handleSwipeLeft = useCallback((id: string): void => {
        setLearnedCards((prev) => [...prev, id]);
    }, []);

    // Remove card from list
    const handleRemove = useCallback((id: string): void => {
        setFlashcards((prev) => prev.filter((card) => card.id !== id));
    }, []);

    // Pull to refresh - reset quiz
    const onRefresh = useCallback((): void => {
        setRefreshing(true);

        setTimeout(() => {
            setFlashcards(initialFlashcards);
            setLearnedCards([]);
            setRefreshing(false);

            Alert.alert(
                '🎉 Quiz Reset!',
                'All flashcards have been restored. Good luck!',
                [{ text: 'Start Learning', style: 'default' }]
            );
        }, 1500);
    }, []);

    // Add new card with animation
    const handleAddCard = useCallback((): void => {
        const newCard: Flashcard = getNewRandomCard();

        setFlashcards((prev) => [newCard, ...prev]);

        // Scroll to top to show new card
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);

        Alert.alert('✨ New Card Added!', `Question: ${newCard.question}`);
    }, []);

    const renderItem: ListRenderItem<Flashcard> = ({ item }) => (
        <FlashCard
            item={item}
            onSwipeLeft={handleSwipeLeft}
            onRemove={handleRemove}
        />
    );

    const renderEmpty = (): React.ReactElement => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>Congratulations!</Text>
            <Text style={styles.emptyText}>
                You've completed all flashcards!
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={onRefresh}>
                <Text style={styles.resetButtonText}>Start New Quiz</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFooter = (): React.ReactElement => (
        <View style={styles.footer}>
            <Text style={styles.footerText}>
                {flashcards.length > 0
                    ? `${flashcards.length} cards remaining`
                    : 'Pull down to refresh'}
            </Text>
        </View>
    );

    const keyExtractor = (item: Flashcard): string => item.id;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

            <ProgressHeader
                scrollY={scrollY}
                learned={learnedCards.length}
                total={learnedCards.length + flashcards.length}
            />

            <Animated.FlatList
                ref={flatListRef}
                data={flashcards}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#6C63FF']}
                        tintColor="#6C63FF"
                        title="Pull to reset quiz..."
                        titleColor="#999"
                    />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.fab} onPress={handleAddCard}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    listContent: {
        paddingVertical: 16,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyEmoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    resetButton: {
        backgroundColor: '#6C63FF',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF5722',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    fabText: {
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: '300',
        marginTop: -2,
    },
});

export default Quiz03;