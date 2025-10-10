import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const [destination, setDestination] = useState('');

    const handleSearch = () => {
        Alert.alert('Success', `Searching for ${destination || 'destinations'}...`);
    };

    const handleExplore = () => {
        console.log('Explore button pressed');
        Alert.alert('Info', 'Start exploring amazing places!');
    };

    return (
        <SafeAreaView style={homeStyles.safeArea}>
            <ScrollView style={homeStyles.container}>

                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800' }}
                    style={homeStyles.image}
                />

                <View style={homeStyles.welcomeContainer}>
                    <Text style={homeStyles.welcomeText}>
                        Welcome to Travel Guide
                    </Text>
                    <Text style={homeStyles.subText}>
                        Your journey to amazing destinations starts here. Discover beautiful places around the world.
                    </Text>
                </View>

                <View style={homeStyles.sloganContainer}>
                    <Text style={homeStyles.sloganText}>
                        <Text style={homeStyles.boldText}>Explore</Text>
                        <Text style={homeStyles.colorfulText}> the World </Text>
                        <Text style={homeStyles.boldText}>with Us</Text>
                    </Text>
                </View>

                <View style={homeStyles.inputContainer}>
                    <TextInput
                        style={homeStyles.input}
                        placeholder="Enter your destination..."
                        value={destination}
                        onChangeText={setDestination}
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity
                    style={homeStyles.elevatedButton}
                    onPress={handleSearch}
                >
                    <Text style={homeStyles.elevatedButtonText}>Search Destination</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyles.textButton}
                    onPress={handleExplore}
                >
                    <Text style={homeStyles.textButtonText}>Explore All Destinations</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const homeStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    welcomeContainer: {
        backgroundColor: '#4A90E2',
        padding: 20,
        margin: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subText: {
        fontSize: 15,
        color: '#fff',
        lineHeight: 22,
    },
    sloganContainer: {
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 15,
    },
    sloganText: {
        fontSize: 24,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#333',
    },
    colorfulText: {
        fontWeight: 'bold',
        color: '#E74C3C',
    },
    inputContainer: {
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    elevatedButton: {
        backgroundColor: '#4A90E2',
        padding: 16,
        marginHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    elevatedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textButton: {
        padding: 15,
        marginHorizontal: 15,
        alignItems: 'center',
        marginBottom: 25,
    },
    textButtonText: {
        color: '#4A90E2',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default HomeScreen;