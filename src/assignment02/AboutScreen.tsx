import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView
} from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutScreen = () => {
    const landmarks = [
        {
            id: 1,
            name: 'Eiffel Tower',
            image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400',
        },
        {
            id: 2,
            name: 'Taj Mahal',
            image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
        },
        {
            id: 3,
            name: 'Statue of Liberty',
            image: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?w=400', // NEW WORKING LINK
        },
        {
            id: 4,
            name: 'Great Wall of China',
            image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
        },
        {
            id: 5,
            name: 'Burj Khalifa',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
        },
        {
            id: 6,
            name: 'Colosseum',
            image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
        },
    ];

    return (
        <SafeAreaView style={aboutStyles.safeArea}>
            <ScrollView style={aboutStyles.container}>
                <View style={aboutStyles.grid}>
                    {landmarks.map((landmark) => (
                        <View key={landmark.id} style={aboutStyles.gridItem}>
                            <Image
                                source={{ uri: landmark.image }}
                                style={aboutStyles.image}
                            />
                            <Text style={aboutStyles.caption}>{landmark.name}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const aboutStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    caption: {
        padding: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});

export default AboutScreen;