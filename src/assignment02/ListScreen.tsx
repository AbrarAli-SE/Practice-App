import React from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList
} from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListScreen = () => {
    const destinations = [
        {
            id: '1',
            name: 'Paris, France',
            description: 'The City of Light, famous for the Eiffel Tower and romantic atmosphere.',
        },
        {
            id: '2',
            name: 'Tokyo, Japan',
            description: 'A blend of traditional and modern culture with amazing technology.',
        },
        {
            id: '3',
            name: 'Dubai, UAE',
            description: 'Luxury shopping, ultramodern architecture and the Burj Khalifa.',
        },
        {
            id: '4',
            name: 'New York, USA',
            description: 'The Big Apple with iconic landmarks like Times Square and Central Park.',
        },
        {
            id: '5',
            name: 'London, UK',
            description: 'Historic city with Big Ben, London Eye and Buckingham Palace.',
        },
        {
            id: '6',
            name: 'Rome, Italy',
            description: 'Ancient city with Colosseum, Vatican City and delicious Italian food.',
        },
        {
            id: '7',
            name: 'Maldives',
            description: 'Tropical paradise with crystal clear waters and beautiful beaches.',
        },
        {
            id: '8',
            name: 'Istanbul, Turkey',
            description: 'Where East meets West, famous for Hagia Sophia and Grand Bazaar.',
        },
        {
            id: '9',
            name: 'Sydney, Australia',
            description: 'Beautiful harbor city with Opera House and stunning beaches.',
        },
        {
            id: '10',
            name: 'Barcelona, Spain',
            description: 'Artistic city with Gaudí architecture and Mediterranean beaches.',
        },
    ];

    const renderDestination = ({ item }: { item: any }) => (
        <View style={listStyles.card}>
            <Text style={listStyles.name}>{item.name}</Text>
            <Text style={listStyles.description}>{item.description}</Text>
        </View>
    );

    return (
        <SafeAreaView style={listStyles.container}>
                <FlatList
                    data={destinations}
                    renderItem={renderDestination}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={listStyles.listContent}
                />
        </SafeAreaView>
    );
};

const listStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default ListScreen;