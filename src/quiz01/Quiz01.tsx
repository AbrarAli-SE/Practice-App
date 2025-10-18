import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Quiz01() {

    const [displayName, setDisplayName] = useState('Abrar Ali');
    const [username, setUsername] = useState('');
    const [validationMessage, setValidationMessage] = useState('');

    const { width, height } = useWindowDimensions();
    const orientation = width > height ? 'Landscape' : 'Portrait';

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        if (text.trim() === '') {
            setValidationMessage('Username cannot be empty!');
        } else {
            setValidationMessage('');
        }
    };

    const handleSubmitUsername = () => {
        if (username.trim() !== '') {
            setDisplayName(username);
            setUsername('');
            setValidationMessage('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.appBar}>
                    <Text style={styles.appBarTitle}>Profile Screen</Text>
                </View>

                <View style={styles.column}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={require('./../../assets/images/profile.jpg')}
                            style={styles.profileImage}
                        />
                    </View>

                    <View style={styles.richTextContainer}>
                        <Text style={styles.nameText}>{displayName}</Text>
                        <Text style={styles.emailText}>abrarali.se@gmail.com</Text>
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.elevatedButton}>
                            <Text style={styles.elevatedButtonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.textButton}>
                            <Text style={styles.textButtonText}>View Details</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionTitle}>About Me</Text>
                        <Text style={styles.descriptionText}>
                            I am a passionate mobile app developer who loves creating
                            beautiful and functional applications. I enjoy learning new
                            technologies and building innovative solutions.
                        </Text>
                    </View>

                    <View style={styles.textFieldContainer}>
                        <Text style={styles.label}>Edit Username:</Text>
                        <TextInput
                            style={styles.textInput}
                            value={username}
                            onChangeText={handleUsernameChange}
                            onSubmitEditing={handleSubmitUsername}
                            placeholder="Enter your username"
                            placeholderTextColor="#999"
                            returnKeyType="done"
                        />
                        {validationMessage ? (
                            <Text style={styles.validationText}>{validationMessage}</Text>
                        ) : null}
                    </View>


                    <View style={styles.orientationContainer}>
                        <Text style={styles.orientationText}>
                            Current Orientation: <Text style={styles.orientationValue}>{orientation}</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
    },

    appBar: {
        backgroundColor: '#6200ee',
        padding: 16,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    appBarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    column: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },

    profileImageContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#6200ee',
    },

    richTextContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 14,
        color: '#666',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },

    elevatedButton: {
        backgroundColor: '#6200ee',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    elevatedButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },

    textButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    textButtonText: {
        color: '#6200ee',
        fontSize: 16,
        fontWeight: '600',
    },

    descriptionContainer: {
        backgroundColor: '#e3f2fd',
        padding: 20,
        borderRadius: 12,
        width: '100%',
        marginBottom: 30,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },

    textFieldContainer: {
        width: '100%',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    validationText: {
        color: '#d32f2f',
        fontSize: 14,
        marginTop: 5,
    },

    orientationContainer: {
        backgroundColor: '#fff3e0',
        padding: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    orientationText: {
        fontSize: 16,
        color: '#333',
    },
    orientationValue: {
        fontWeight: 'bold',
        color: '#f57c00',
    },
});