import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

export default function Lab5() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.appBar}>
                <Text style={styles.appBarTitle}>Abrar Ali</Text>
            </View>

            <View style={{ padding: 16 }}>
                <View style={styles.row}>
                    <View style={[styles.box, styles.yellowBox]} />
                    <View style={styles.paddingSpacer} />
                    <View style={[styles.box, styles.amberBox, styles.expanded]} />
                    <View style={styles.paddingSpacer} />
                    <View style={[styles.box, styles.brownBox]} />
                </View>

                <View style={styles.paddingSpacer} />

                <View style={styles.row}>
                    <View>
                        <View style={[styles.box, styles.yellowBox, { width: 60, height: 60 }]} />
                        <View style={styles.paddingSpacer} />
                        <View style={[styles.box, styles.amberBox, { width: 40, height: 40 }]} />
                        <View style={styles.paddingSpacer} />
                        <View style={[styles.box, styles.brownBox, { width: 20, height: 20 }]} />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.circleContainer}>
                    <View style={[styles.stackItem, styles.yellowCircle]} />
                    <View style={[styles.stackItem, styles.amberCircle]} />
                    <View style={[styles.stackItem, styles.brownCircle]} />
                </View>

                <View style={styles.divider} />

                <Text style={styles.endText}>End of the Line</Text>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    appBar: {
        backgroundColor: '#007AFF',
        padding: 16,
        alignItems: 'center',
    },
    appBarTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    paddingAll: {
        padding: 16,
    },
    paddingSpacer: {
        width: 16,
        height: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    box: {
        alignSelf: 'flex-start',
    },
    yellowBox: {
        backgroundColor: 'yellow',
        width: 40,
        height: 40,
    },
    amberBox: {
        backgroundColor: 'orange',
        width: 40,
        height: 40,
    },
    brownBox: {
        backgroundColor: 'brown',
        width: 40,
        height: 40,
    },
    expanded: {
        flex: 1,
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginVertical: 16,
    },
    circleContainer: {
        position: 'relative',
        width: 200,
        height: 200,
        backgroundColor: 'lightgreen',
        borderRadius: 100,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    stackItem: {
        position: 'absolute',
        marginTop: 50,
        marginStart: 50,

    },
    yellowCircle: {
        width: 100,
        height: 100,
        backgroundColor: 'yellow',
    },
    amberCircle: {
        width: 60,
        height: 60,
        backgroundColor: 'orange',
    },
    brownCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'brown',
    },
    endText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
    },
});