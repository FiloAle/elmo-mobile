import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/theme';

const CATEGORIES = [
    { id: '0', name: 'Charging', icon: 'ev-station' },
    { id: '1', name: 'Restaurant', icon: 'silverware-fork-knife' },
    { id: '2', name: 'Bar', icon: 'glass-cocktail' },
    { id: '3', name: 'Coffee', icon: 'coffee' },
    { id: '4', name: 'Shopping', icon: 'shopping' },
    { id: '5', name: 'Supermarket', icon: 'cart' },
];

const CHARGING_STATIONS = [
    { id: '1', name: 'Tesla Supercharger', address: 'Via Monte Napoleone, 12', distance: '1.2 km', status: 'Available', power: '250kW', image: require('../assets/images/tesla.jpg') },
    { id: '2', name: 'Enel X Way', address: 'Corso Como, 5', distance: '2.5 km', status: 'Busy', power: '50kW', image: require('../assets/images/enel.jpg') },
    { id: '3', name: 'Ionity', address: 'A8 Service Station', distance: '8.0 km', status: 'Available', power: '350kW', image: require('../assets/images/ionity.jpg') },
    { id: '4', name: 'Be Charge', address: 'Piazza Gae Aulenti', distance: '3.1 km', status: 'Available', power: '150kW', image: require('../assets/images/becharge.jpg') },
];

const GENERAL_PLACES = [
    { id: '1', name: 'Starbucks Reserve', address: 'Piazza Cordusio', distance: '0.8 km', status: 'Open', power: null, image: require('../assets/images/starbucks.jpg') },
    { id: '2', name: 'Marchesi 1824', address: 'Galleria Vittorio Emanuele II', distance: '1.0 km', status: 'Busy', power: null, image: require('../assets/images/marchesi.jpg') },
    { id: '3', name: 'Camparino in Galleria', address: 'Piazza del Duomo', distance: '0.9 km', status: 'Open', power: null, image: require('../assets/images/camparino.jpg') },
    { id: '4', name: 'Pasticceria Cova', address: 'Via Montenapoleone', distance: '1.2 km', status: 'Open', power: null, image: require('../assets/images/cova.jpg') },
];

export default function AddStopScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Bottom Sheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { height } = require('react-native').useWindowDimensions();
    const HEADER_HEIGHT = 160;
    const topSnapPoint = height - HEADER_HEIGHT;
    const snapPoints = useMemo(() => ['30%', topSnapPoint], [topSnapPoint]);

    useEffect(() => {
        if (activeCategory) {
            bottomSheetRef.current?.snapToIndex(1);
        } else {
            bottomSheetRef.current?.close();
        }
    }, [activeCategory]);

    const handleCategoryPress = (category: string) => {
        setActiveCategory(prev => prev === category ? null : category);
    };

    const renderGridItem = ({ item }: { item: any }) => {
        // Randomly assign images for demo purposes
        const images = [
            require('../assets/images/monte bianco.jpg'),
            require('../assets/images/Percorso Arona.jpg'),
            require('../assets/images/Percorso lecco.jpg'),
            require('../assets/images/background map.jpg')
        ];
        // If item has a specific image, use it. Otherwise, pick randomly.
        const imgIndex = parseInt(item.id) % images.length;
        const imageSource = item.image || images[imgIndex];

        // Random rating for mock
        const rating = (4.5 + Math.random() * 0.5).toFixed(1);

        return (
            <View style={styles.gridCard}>
                {/* Image Section */}
                <View style={styles.cardImageWrapper}>
                    <Image source={imageSource} style={styles.cardImage} contentFit="cover" />

                    {/* Rating Badge */}
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={10} color="#FFD700" />
                        <Text style={styles.ratingText}>{rating}</Text>
                    </View>
                </View>

                {/* Info Section */}
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardDetails}>{item.distance} • 15 min</Text>

                {/* Add Button */}
                <TouchableOpacity style={styles.addStopPill} onPress={() => console.log('Add', item.name)}>
                    <Ionicons name="add" size={16} color="#000" />
                    <Text style={styles.addStopText}>Add Stop</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />

                {/* Static Background Map */}
                <ImageBackground
                    source={require('../assets/images/background map.jpg')}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                >
                    <View style={styles.overlay} />
                </ImageBackground>

                {/* Floating Top Section */}
                <View style={[styles.floatingHeader, { top: insets.top + 10 }]}>

                    {/* Search Row */}
                    <View style={styles.searchRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <View style={styles.searchPill}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search here..."
                                placeholderTextColor="#888"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                            <Image
                                source={require('../assets/images/elmo search.png')}
                                style={styles.searchIcon}
                                contentFit="contain"
                            />
                        </View>
                    </View>

                    {/* Horizontal Category Tags */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContent}
                        style={styles.categoriesContainer}
                    >
                        {CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.name;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                                    activeOpacity={0.8}
                                    onPress={() => handleCategoryPress(cat.name)}
                                >
                                    <MaterialCommunityIcons
                                        name={cat.icon as any}
                                        size={20}
                                        color={isActive ? '#000' : '#FFF'}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Bottom Sheet Results */}
                {activeCategory && (
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={0} // Start at 30%
                        snapPoints={snapPoints}
                        handleIndicatorStyle={{ backgroundColor: '#333', width: 40, height: 4, borderRadius: 2, marginTop: 8 }}
                        backgroundStyle={{ backgroundColor: '#051616', borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
                        style={{ zIndex: 50 }}
                        enablePanDownToClose={true}
                        topInset={160}
                        onClose={() => setActiveCategory(null)}
                    >
                        <View style={styles.bottomSheetContent}>
                            <View style={styles.sheetHeaderRow}>
                                <Text style={styles.sheetTitle}>Nearby {activeCategory === 'Charging' ? 'Stations' : activeCategory}</Text>
                                <TouchableOpacity>
                                    <Text style={styles.seeAllText}>Vedi tutti (12)</Text>
                                </TouchableOpacity>
                            </View>

                            <BottomSheetFlatList
                                data={activeCategory === 'Charging' ? CHARGING_STATIONS : GENERAL_PLACES}
                                keyExtractor={(item) => item.id}
                                renderItem={renderGridItem}
                                contentContainerStyle={styles.listContent}
                                numColumns={2}
                                columnWrapperStyle={styles.columnWrapper}
                            />
                        </View>
                    </BottomSheet>
                )}

            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#051616',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 22, 22, 0.2)',
    },
    floatingHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 20,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
        gap: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#27272A',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    searchPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#051616',
        borderRadius: 25,
        height: 45,
        paddingLeft: 16,
        paddingRight: 6,
        shadowColor: '#051616',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        marginRight: 10,
    },
    searchIcon: {
        width: 40,
        height: 40,
    },
    categoriesContainer: {
        paddingVertical: 5,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#27272A',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    categoryChipActive: {
        backgroundColor: Colors.elmo.accent, // Mint Green
        borderColor: Colors.elmo.accent,
    },
    categoryText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '300',
    },
    categoryTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    // Bottom Sheet Styles
    bottomSheetContent: {
        flex: 1,
        backgroundColor: '#051616',
        paddingHorizontal: 20,
    },
    sheetHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    sheetTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAllText: {
        color: Colors.elmo.accent,
        fontSize: 14,
        fontWeight: '400',
    },
    listContent: {
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        gap: 12,
    },
    // Grid Card Styles
    gridCard: {
        flex: 1, // Take up available space in column (approx 50%)
        width: '48%', // Fallback
        backgroundColor: '#0F1F1F',
        borderRadius: 16,
        marginBottom: 16,
        padding: 10,
        // Optional: Border if needed
        // borderWidth: 1,
        // borderColor: '#1A2A2A',
    },
    cardImageWrapper: {
        width: '100%',
        aspectRatio: 1, // Square
        borderRadius: 16,
        backgroundColor: '#1A2A2A', // Placeholder bg
        marginBottom: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDetails: {
        color: '#889999',
        fontSize: 13,
        marginBottom: 12,
    },
    addStopPill: {
        backgroundColor: Colors.elmo.accent,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    addStopText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '600',
    },
});
