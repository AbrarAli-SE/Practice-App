import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const lab6 = () => {
    const [searchableData, setSearchableData] = useState(['Abrar Ali', 'Azhar', 'Ali', 'Shameel']);
    const [filteredData, setFilteredData] = useState(searchableData);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredData(searchableData);
        } else {
            const filtered = searchableData.filter(item =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, searchableData]);

    const handleAddItem = () => {
        if (newItem.trim() === '') {
            Alert.alert('Error', 'Please enter a name.');
            return;
        }
        setSearchableData([...searchableData, newItem.trim()]);
        setNewItem('');
        Keyboard.dismiss();
    };

    const toggleSearchBar = () => {
        setIsSearchVisible(!isSearchVisible);
        if (isSearchVisible) {
            setSearchQuery(''); 
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.appBar}>s
                    <View style={styles.profileInfo}>
                        <Image
                            source={require('../../assets/images/profile.jpg')}
                            style={styles.profileImage}
                        />
                        <Text style={styles.profileName}>Abrar Ali</Text>
                    </View>
                    <TouchableOpacity onPress={toggleSearchBar}>
                        <Text style={styles.iconPlaceholder}>🔎︎</Text>
                    </TouchableOpacity>
                </View>

                {isSearchVisible && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search names..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Alert.alert('Action 1 Pressed')}>
                        <Text style={styles.actionButtonText}>Action 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Alert.alert('Action 2 Pressed')}>
                        <Text style={styles.actionButtonText}>Action 2</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>{item}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    style={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyListText}>No names found.</Text>}
                />

                <View style={styles.addBar}>
                    <TextInput
                        style={styles.addInput}
                        placeholder="Add a new name..."
                        value={newItem}
                        onChangeText={setNewItem}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { flex: 1 },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileInfo: { flexDirection: 'row', alignItems: 'center' },
    profileImage: { width: 40, height: 40, borderRadius: 20 },
    profileName: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
    iconPlaceholder: { fontSize: 24 },
    searchContainer: { padding: 10, backgroundColor: '#fff' },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
    actionButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    actionButtonText: { color: '#fff', fontSize: 16 },
    list: { flex: 1 },
    listItem: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    listItemText: { fontSize: 18 },
    emptyListText: { textAlign: 'center', marginTop: 20, color: 'grey' },
    addBar: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    addInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#28a745',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default lab6;