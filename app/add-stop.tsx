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
    { id: '1', name: 'Tesla Supercharger', address: 'Via Monte Napoleone, 12', distance: '1.2 km', status: 'Available', power: '250kW' },
    { id: '2', name: 'Enel X Way', address: 'Corso Como, 5', distance: '2.5 km', status: 'Busy', power: '50kW' },
    { id: '3', name: 'Ionity', address: 'A8 Service Station', distance: '8.0 km', status: 'Available', power: '350kW' },
];

const GENERAL_PLACES = [
    { id: '1', name: 'Starbucks Reserve', address: 'Piazza Cordusio', distance: '0.8 km', status: 'Open', power: null },
    { id: '2', name: 'Marchesi 1824', address: 'Galleria Vittorio Emanuele II', distance: '1.0 km', status: 'Busy', power: null },
    { id: '3', name: 'Camparino in Galleria', address: 'Piazza del Duomo', distance: '0.9 km', status: 'Open', power: null },
];

export default function AddStopScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Bottom Sheet
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['30%', '90%'], []);

    useEffect(() => {
        if (activeCategory) {
            bottomSheetRef.current?.snapToIndex(0);
        } else {
            bottomSheetRef.current?.close();
        }
    }, [activeCategory]);

    const handleCategoryPress = (category: string) => {
        setActiveCategory(prev => prev === category ? null : category);
    };

    const renderStationItem = ({ item }: { item: typeof CHARGING_STATIONS[0] }) => (
        <View style={styles.resultItem}>
            {/* Left Icon */}
            <View style={styles.resultIconContainer}>
                <MaterialCommunityIcons name="flash" size={24} color={Colors.elmo.accent} />
            </View>

            {/* Center Text */}
            <View style={styles.resultTextContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.resultTitle}>{item.name}</Text>
                    <Text style={styles.resultDistance}>{item.distance}</Text>
                </View>
                <Text style={styles.resultAddress}>{item.address}</Text>
                <View style={styles.statusRow}>
                    <Text style={[styles.statusText, { color: item.status === 'Available' || item.status === 'Open' ? Colors.elmo.accent : '#FF4444' }]}>
                        {item.status}
                    </Text>
                    {item.power && <Text style={styles.powerText}>• {item.power}</Text>}
                </View>
            </View>

            {/* Right Logic (Add Button) */}
            <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add station', item.name)}>
                <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );

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
                        handleIndicatorStyle={{ backgroundColor: '#555', width: 40 }}
                        backgroundStyle={{ backgroundColor: '#051616' }}
                        style={{ zIndex: 50 }}
                        enablePanDownToClose={true}
                        onClose={() => setActiveCategory(null)}
                    >
                        <View style={styles.bottomSheetContent}>
                            <Text style={styles.sheetTitle}>Nearby {activeCategory === 'Charging' ? 'Stations' : activeCategory}</Text>
                            <BottomSheetFlatList
                                data={activeCategory === 'Charging' ? CHARGING_STATIONS : GENERAL_PLACES}
                                keyExtractor={(item) => item.id}
                                renderItem={renderStationItem}
                                contentContainerStyle={styles.listContent}
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
    sheetTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginTop: 8,
    },
    listContent: {
        paddingBottom: 40,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F1F1F',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    resultIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    resultTextContainer: {
        flex: 1,
        marginRight: 8,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    resultTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resultDistance: {
        color: '#889999',
        fontSize: 14,
    },
    resultAddress: {
        color: '#AAAAAA',
        fontSize: 13,
        marginBottom: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    powerText: {
        color: '#889999',
        fontSize: 13,
        marginLeft: 4,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.elmo.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
