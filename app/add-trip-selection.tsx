
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AddTripSelectionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedMode, setSelectedMode] = useState<string | null>(null);

    const handleSelect = (mode: string) => {
        setSelectedMode(mode);
        // Logic for next step
        console.log(`Selected: ${mode}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { marginTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>

                <Image
                    source={require('../assets/images/Elmo logo dark.svg')}
                    style={styles.logo}
                    contentFit="contain"
                />

                <View style={styles.profileAvatar}>
                    <Image
                        source={require('../assets/images/profile image.jpeg')}
                        style={styles.avatarImage}
                        contentFit="cover"
                    />
                </View>
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
                                source={require('../assets/images/travel_alone.png')}
                                style={styles.cardImage}
                                contentFit="cover"
                            />
                        </TouchableOpacity>
                        <Text style={styles.cardLabel}>Alone</Text>
                    </View>

                    {/* With Others Card */}
                    <View style={styles.cardWrapper}>
                        <TouchableOpacity
                            style={[styles.card, selectedMode === 'With others' && styles.cardActive]}
                            activeOpacity={0.7}
                            onPress={() => handleSelect('With others')}
                        >
                            <Image
                                source={require('../assets/images/travel_with_others.png')}
                                style={styles.cardImage}
                                contentFit="cover"
                            />
                        </TouchableOpacity>
                        <Text style={styles.cardLabel}>With others</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#051616', // Primary dark
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
        height: 60,
    },
    headerButton: {
        width: 40,
        alignItems: 'flex-start',
    },
    logo: {
        width: 80,
        height: 30,
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#000',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        alignItems: 'center', // Horizontally center content
        paddingTop: 40, // Space from header
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 40,
        textAlign: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        width: '100%',
    },
    cardWrapper: {
        width: '46%', // Approximately 46% width
        alignItems: 'center',
    },
    card: {
        width: '100%',
        aspectRatio: 0.8, // Slightly vertical
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#0F1F1F', // Slightly lighter
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardActive: {
        borderColor: Colors.elmo.accent,
        borderWidth: 2,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardLabel: {
        color: Colors.elmo.accent, // Mint Green
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
