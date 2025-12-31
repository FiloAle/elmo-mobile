import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function AddTripSelectionScreen() {
    const router = useRouter();
    const [selectedMode, setSelectedMode] = useState<string | null>(null);

    const handleSelect = (mode: string) => {
        setSelectedMode(mode);
        // Logic for next step
        console.log(`Selected: ${mode}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            {/* Header with Back Button Only */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>How are you traveling?</Text>

                <View style={styles.cardsContainer}>
                    {/* Alone Card */}
                    <View style={styles.cardWrapper}>
                        <TouchableOpacity
                            style={[styles.card, selectedMode === 'Alone' && styles.cardActive]}
                            activeOpacity={0.7}
                            onPress={() => handleSelect('Alone')}
                        >
                            <Image
                                source={require('../assets/images/alone.png')}
                                style={styles.cardImage}
                                contentFit="cover"
                            />
                        </TouchableOpacity>
                        <Text style={[styles.cardLabel, selectedMode === 'Alone' && styles.cardLabelActive]}>Alone</Text>
                    </View>

                    {/* With Others Card */}
                    <View style={styles.cardWrapper}>
                        <TouchableOpacity
                            style={[styles.card, selectedMode === 'With others' && styles.cardActive]}
                            activeOpacity={0.7}
                            onPress={() => handleSelect('With others')}
                        >
                            <Image
                                source={require('../assets/images/with others.png')}
                                style={styles.cardImage}
                                contentFit="cover"
                            />
                        </TouchableOpacity>
                        <Text style={[styles.cardLabel, selectedMode === 'With others' && styles.cardLabelActive]}>With others</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#01191D', // Primary dark
    },
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        zIndex: 20,
        flexDirection: 'row', // Ensure button aligns correctly if we add more items later, but fine with just one
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#27272A',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    content: {
        flex: 1,
        alignItems: 'center', // Horizontally center content
        paddingTop: 120, // Increased padding to account for absolute header
    },
    title: {
        fontSize: 27,
        fontWeight: '200',
        color: '#FFF',
        marginTop: 24,
        marginBottom: 56,
        textAlign: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        width: '100%',
    },
    cardWrapper: {
        width: '48%', // Wider
        alignItems: 'center',
    },
    card: {
        width: '100%',
        aspectRatio: 1, // Squared
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: Colors.elmo.cardDark, // Slightly lighter
        marginBottom: 16,

    },
    cardActive: {
        borderColor: Colors.elmo.accent,
        borderWidth: 1,
        shadowColor: Colors.elmo.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardLabel: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '300',
        textAlign: 'center',
    },
    cardLabelActive: {
        color: Colors.elmo.accent,
    },
});
