import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Practice() {
    const [currentBid, setCurrentBid] = React.useState(0);
    const [selectorAmount, setSelectorAmount] = React.useState(50);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [error, setError] = React.useState('');
    const selectorOptions = [1, 5, 10, 50, 100, 500, 1000];

    
    const decreaseAmount = () => {
        if (selectorAmount > 1) {
            setSelectorAmount(selectorAmount - 1);
        }
    };

    
    const increaseAmount = () => {
        setSelectorAmount(selectorAmount + 1);
    };

    const handleUp = () => {
        setCurrentBid(currentBid + selectorAmount);
        setError('');
    };

    const handleDown = () => {
        if (currentBid - selectorAmount < 0) {
            setError('Cannot subtract more than current bid');
        } else {
            setCurrentBid(currentBid - selectorAmount);
            setError('');
        }
    };


    interface HandleSelectAmount {
        (value: number): void;
    }

    const handleSelectAmount: HandleSelectAmount = (value) => {
        setSelectorAmount(value);
        setShowDropdown(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerSubTitle}>Lab Task by</Text>
                <Text style={styles.headerTitle}>Abrar Ali</Text>
                <Text style={styles.appTitle}>Bidding App</Text>
            </View>

            <View style={styles.bidDisplay}>
                <Text style={styles.bidDisplayText}>${currentBid}</Text>
            </View>

            <View style={styles.amountSelectorRow}>
                <TouchableOpacity style={styles.amountSelectorButton}
                    onPress={decreaseAmount}
                >
                    <Text style={styles.amountSelectorButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.amountSelectorDropdown} onPress={() => setShowDropdown(!showDropdown)}>
                    <Text style={styles.amountSelectorDropdownText}>{selectorAmount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.amountSelectorButton, {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                }]}
                    onPress={increaseAmount}>
                    <Text style={styles.amountSelectorButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {showDropdown && (
                <View style={styles.dropdownMenu}>
                    {selectorOptions.map((val) => (
                        <TouchableOpacity key={val} style={styles.dropdownItem} onPress={() => handleSelectAmount(val)}>
                            <Text style={styles.dropdownItemText}>{val}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleUp}>
                    <Text style={styles.actionButtonText}>Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#e74c3c' }]} onPress={handleDown}>
                    <Text style={styles.actionButtonText}>Down</Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 24,
        paddingTop: 32,
        justifyContent: 'flex-start',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    headerSubTitle: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
    },
    headerTitle: {
        alignSelf: 'flex-start',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d3436',
        marginTop: 2,
    },
    appTitle: {
        fontSize: 32,
        color: '#0984e3',
        fontWeight: '700',
        marginTop: 8,
    },

    bidDisplay: {
        height: 100,
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#0984e3',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 24,
        alignSelf: 'center',
    },

    bidDisplayText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#2d3436',
    },

    amountSelectorRow: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    amountSelectorButton: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#b2bec3',
        backgroundColor: '#f4f6fb',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    amountSelectorButtonText: {
        fontSize: 28,
        color: '#636e72',
        fontWeight: 'bold',
    },
    amountSelectorDropdown: {
        width: 60,
        height: 40,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#b2bec3',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    amountSelectorDropdownText: {
        fontSize: 22,
        color: '#0984e3',
        fontWeight: '600',
    },
    actionButtonsRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },
    actionButton: {
        backgroundColor: '#0984e3',
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    errorText: {
        color: '#e74c3c',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
    dropdownMenu: {
        position: 'absolute',
        right: 52,
        top: 330,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#b2bec3',
        borderRadius: 8,
        zIndex: 10,
        width: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 18,
        color: '#0984e3',
        textAlign: 'center',
    },
});