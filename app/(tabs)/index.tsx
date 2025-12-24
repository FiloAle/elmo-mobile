import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/theme';

const CATEGORIES = [
  { id: '0', name: 'Charging' },
  { id: '1', name: 'Restaurant' },
  { id: '2', name: 'Bar' },
  { id: '3', name: 'Coffee' },
  { id: '4', name: 'Shopping' },
  { id: '5', name: 'Supermarket' },
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

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '90%'], []);

  useEffect(() => {
    // Ensure sheet stays open. When category changes, we can optionally snap to a specific point.
    // For now, keep it simple: always ensure it's at least at index 0.
    bottomSheetRef.current?.snapToIndex(0);
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
        {/* Static Background Map */}
        <ImageBackground
          source={require('../../assets/images/background map.jpg')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>

        {/* Floating Top Section */}
        <View style={[styles.floatingHeader, { top: insets.top }]}>

          {/* Header Row (Logo + Profile) */}
          <View style={styles.headerRow}>
            <Image
              source={require('../../assets/images/Elmo logo dark.svg')}
              style={styles.logo}
              contentFit="contain"
            />
            <View style={styles.profileAvatar}>
              <Image
                source={require('../../assets/images/profile image.jpeg')}
                style={{ width: '100%', height: '100%', borderRadius: 20, borderWidth: 1, borderColor: '#000' }}
                contentFit="cover"
              />
            </View>
          </View>

          {/* Search Row */}
          <View style={styles.searchRow}>
            {/* Removed Back Button for Home Screen */}

            <View style={styles.searchPill}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search here..."
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
              />
              <Image
                source={require('../../assets/images/elmo search.png')}
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
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Bottom Sheet Results */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0} // Start at 40%
          snapPoints={['40%', '90%']}
          handleIndicatorStyle={{ backgroundColor: '#555', width: 40 }}
          backgroundStyle={{ backgroundColor: '#051616' }}
          style={{ zIndex: 50 }}
          enablePanDownToClose={false}
        >
          <View style={styles.bottomSheetContent}>
            {activeCategory ? (
              <>
                <Text style={styles.sheetTitle}>Nearby {activeCategory === 'Charging' ? 'Stations' : activeCategory}</Text>
                <BottomSheetFlatList
                  data={activeCategory === 'Charging' ? CHARGING_STATIONS : GENERAL_PLACES}
                  keyExtractor={(item: { id: string }) => item.id}
                  renderItem={renderStationItem}
                  contentContainerStyle={styles.listContent}
                />
              </>
            ) : (
              <ScrollView contentContainerStyle={styles.homeSheetContent} showsVerticalScrollIndicator={false}>
                {/* Traffic Conditions Card */}
                <View style={styles.lightCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={styles.cardHeaderTitle}>Traffic conditions</Text>
                  </View>

                  <View style={styles.trafficRow}>
                    <View style={styles.alertIconContainer}>
                      <MaterialCommunityIcons name="car-multiple" size={20} color="#FFF" />
                    </View>
                    <View style={styles.trafficInfo}>
                      <Text style={styles.alertTitle}>Accident in Via Candiani</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.alertDistance}>1.2 km away</Text>
                      </View>
                    </View>
                    <Text style={styles.alertDelay}>+11 min</Text>
                  </View>
                </View>

                {/* Destination Shortcuts Grid */}
                <View style={styles.shortcutsGrid}>
                  {/* Home */}
                  <TouchableOpacity style={styles.shortcutCard} activeOpacity={0.8}>
                    <View>
                      <Text style={styles.shortcutTitle}>Casa</Text>
                      <Text style={styles.shortcutAddress}>Via Durando, 10</Text>
                    </View>
                    <Text style={styles.shortcutDistance}>20 km</Text>
                  </TouchableOpacity>

                  {/* Work */}
                  <TouchableOpacity style={styles.shortcutCard} activeOpacity={0.8}>
                    <View>
                      <Text style={styles.shortcutTitle}>Lavoro</Text>
                      <Text style={styles.shortcutAddress}>Piazza Leonardo, 32</Text>
                    </View>
                    <Text style={styles.shortcutDistance}>5 km</Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Padding for Navigation Bar */}
                <View style={{ height: 100 }} />
              </ScrollView>
            )}
          </View>
        </BottomSheet>

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
    // gap: 12, // Removed gap since back button is gone, or keep if adding profile icon later
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
    marginBottom: 8,
  },
  logo: {
    width: 100,
    height: 40,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elmo.accent,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
  // Home Sheet Content
  homeSheetContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  lightCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  trafficRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444', // Red
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trafficInfo: {
    flex: 1,
  },
  alertTitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  alertDistance: {
    color: '#71717A',
    fontSize: 12,
  },
  alertDelay: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  shortcutTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shortcutAddress: {
    color: '#71717A',
    fontSize: 12,
  },
  shortcutDistance: {
    color: '#71717A', // Or maybe accent color if we want to highlight it
    fontSize: 12,
    fontWeight: '500',
    marginTop: 12,
  },
});
