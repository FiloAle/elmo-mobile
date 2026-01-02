import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
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
  { id: '4', name: 'Be Charge', address: 'Piazza Gae Aulenti', distance: '3.1 km', status: 'Available', power: '150kW' },
];

const GENERAL_PLACES = [
  { id: '1', name: 'Starbucks Reserve', address: 'Piazza Cordusio', distance: '0.8 km', status: 'Open', power: null },
  { id: '2', name: 'Marchesi 1824', address: 'Galleria Vittorio Emanuele II', distance: '1.0 km', status: 'Busy', power: null },
  { id: '3', name: 'Camparino in Galleria', address: 'Piazza del Duomo', distance: '0.9 km', status: 'Open', power: null },
  { id: '4', name: 'Pasticceria Cova', address: 'Via Montenapoleone', distance: '1.2 km', status: 'Open', power: null },
  { id: '4', name: 'Pasticceria Cova', address: 'Via Montenapoleone', distance: '1.2 km', status: 'Open', power: null },
];

const SAVED_LOCATIONS = [
  { id: '1', name: 'Supermarket', address: 'Via Dante, 4', icon: 'cart' },
  { id: '2', name: 'Gym', address: 'Corso Buenos Aires, 10', icon: 'dumbbell' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  // Toggle States for Route Preferences
  const [routePreference, setRoutePreference] = useState<'fast' | 'economic'>('fast');

  // Bottom Sheet Ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height } = require('react-native').useWindowDimensions();
  const HEADER_HEIGHT = 220;
  const topSnapPoint = height - HEADER_HEIGHT;
  const snapPoints = useMemo(() => ['45%', '70%', topSnapPoint], [topSnapPoint]);

  // Stable Bottom Sheet Behavior
  useEffect(() => {
    if (activeCategory || selectedPlace) {
      // Expand to 70% when content is active
      bottomSheetRef.current?.snapToIndex(1);
    } else {
      // Return to 45% (Dashboard) otherwise
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [activeCategory, selectedPlace]);

  const handleCategoryPress = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
    setSelectedPlace(null); // Reset detail when changing category
  };

  const renderGridItem = ({ item }: { item: any }) => {
    // Randomly assign images for demo purposes (matching add-stop.tsx)
    const images = [
      require('../../assets/images/monte bianco.jpg'),
      require('../../assets/images/Percorso Arona.jpg'),
      require('../../assets/images/Percorso lecco.jpg'),
      require('../../assets/images/background map.jpg')
    ];
    // Hash id to pick image consistently
    const imgIndex = parseInt(item.id) % images.length;
    const imageSource = images[imgIndex];

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
        <Text style={styles.cardDetails}>{item.distance || '0 km'} • 15 min</Text>

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

        {/* ================= SINGLE BOTTOM SHEET ================= */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0} // Default Open at 45%
          snapPoints={snapPoints}
          handleStyle={selectedPlace ? { position: 'absolute', width: '100%', zIndex: 10 } : undefined}
          handleIndicatorStyle={{
            backgroundColor: selectedPlace ? 'rgba(255,255,255,0.8)' : '#333',
            width: 40,
            height: 4,
            borderRadius: 2,
            marginTop: 8
          }}
          backgroundStyle={{ backgroundColor: '#051616', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}
          style={{ zIndex: 50 }}
          enablePanDownToClose={false}
          enableOverDrag={false}
          topInset={HEADER_HEIGHT}
        >
          {selectedPlace ? (
            // PLACE DETAIL VIEW
            <View style={{ flex: 1, backgroundColor: '#051616', paddingHorizontal: 0, paddingTop: 0 }}>
              {/* Hero Image */}
              <View style={styles.detailHeader}>
                <Image
                  source={selectedPlace.image || require('../../assets/images/background map.jpg')}
                  style={[styles.detailImage, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
                  contentFit="cover"
                />
                {/* Overlay Back Button */}
                <TouchableOpacity onPress={() => setSelectedPlace(null)} style={[styles.backButtonOverlay, { top: 16 }]}>
                  <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                <Text style={styles.detailName}>{selectedPlace.name}</Text>
                <Text style={styles.detailAddress}>{selectedPlace.address}</Text>

                <View style={styles.badgesWrapper}>
                  {/* Fast Toggle */}
                  <TouchableOpacity
                    style={[styles.preferenceBadge, routePreference === 'fast' && styles.preferenceBadgeActive]}
                    activeOpacity={0.8}
                    onPress={() => setRoutePreference('fast')}
                  >
                    <MaterialCommunityIcons
                      name="lightning-bolt"
                      size={16}
                      color={routePreference === 'fast' ? Colors.elmo.accent : "#FFF"}
                    />
                    <Text style={routePreference === 'fast' ? styles.preferenceTextActive : styles.preferenceText}>Fast</Text>
                  </TouchableOpacity>

                  {/* Economic Toggle */}
                  <TouchableOpacity
                    style={[styles.preferenceBadge, routePreference === 'economic' && styles.preferenceBadgeActive]}
                    activeOpacity={0.8}
                    onPress={() => setRoutePreference('economic')}
                  >
                    <MaterialCommunityIcons
                      name="leaf"
                      size={16}
                      color={routePreference === 'economic' ? Colors.elmo.accent : "#FFF"}
                    />
                    <Text style={routePreference === 'economic' ? styles.preferenceTextActive : styles.preferenceText}>Economic</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.startNavButton} onPress={() => console.log('Start Nav')}>
                  <Ionicons name="navigate" size={20} color="#000" style={{ marginRight: 8 }} />
                  <Text style={styles.startNavText}>Start Navigation</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.bottomSheetContent}>
              {activeCategory ? (
                <>
                  <Text style={styles.sheetTitle}>Nearby {activeCategory === 'Charging' ? 'Stations' : activeCategory}</Text>
                  <BottomSheetFlatList
                    data={activeCategory === 'Charging' ? CHARGING_STATIONS : GENERAL_PLACES}
                    keyExtractor={(item: { id: string }) => item.id}
                    renderItem={renderGridItem}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                  />
                </>
              ) : (
                <ScrollView
                  contentContainerStyle={styles.homeSheetContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Traffic Conditions Card */}
                  <Text style={styles.sectionHeaderTitle}>Traffic conditions</Text>
                  <View style={styles.lightCard}>
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

                  {/* Destination Shortcuts (Commuting) */}
                  <Text style={styles.sectionHeaderTitle}>Commuting</Text>
                  <View style={styles.shortcutsGrid}>
                    {/* Home */}
                    <TouchableOpacity
                      style={styles.shortcutCard}
                      activeOpacity={0.8}
                      onPress={() => setSelectedPlace({
                        name: 'Home',
                        address: 'Via Durando 10, Milano, Italia',
                        image: require('../../assets/images/background map.jpg')
                      })}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons name="home" size={24} color={Colors.elmo.accent} />
                      </View>
                      <View>
                        <Text style={styles.shortcutTitle}>Home</Text>
                        <Text style={styles.shortcutAddress}>Via Durando, 10</Text>
                      </View>
                      <Text style={styles.shortcutDistance}>20 km</Text>
                    </TouchableOpacity>

                    {/* Work */}
                    <TouchableOpacity
                      style={styles.shortcutCard}
                      activeOpacity={0.8}
                      onPress={() => setSelectedPlace({
                        name: 'Politecnico di Milano',
                        address: 'Via Candiani 72, Milano, Italia',
                        image: require('../../assets/images/bovisa.avif')
                      })}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons name="briefcase" size={24} color={Colors.elmo.accent} />
                      </View>
                      <View>
                        <Text style={styles.shortcutTitle}>Work Place</Text>
                        <Text style={styles.shortcutAddress}>Piazza Leonardo, 32</Text>
                      </View>
                      <Text style={styles.shortcutDistance}>5 km</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Saved Locations List */}
                  <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>Saved Locations</Text>
                  <View style={styles.savedLocationsList}>
                    {SAVED_LOCATIONS.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.savedLocationItem}
                        onPress={() => setSelectedPlace(item)}
                        activeOpacity={0.6}
                      >
                        {/* Left Icon */}
                        <View style={styles.savedIconContainer}>
                          <MaterialCommunityIcons name={item.icon as any} size={24} color={Colors.elmo.accent} />
                        </View>

                        {/* Center Text */}
                        <View style={styles.savedTextStack}>
                          <Text style={styles.savedLocationName}>{item.name}</Text>
                          <Text style={styles.savedLocationAddress}>{item.address}</Text>
                        </View>

                        {/* Right Icon */}
                        <Ionicons name="chevron-forward" size={20} color="#555" />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Bottom Padding for Navigation Bar */}
                  <View style={{ height: 100 }} />
                </ScrollView>
              )}
            </View>
          )}
        </BottomSheet>

      </View >
    </GestureHandlerRootView >
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
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionHeaderTitle: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  // Grid Card Styles (Matched to add-stop.tsx)
  gridCard: {
    width: '48%',
    backgroundColor: '#0F1F1F',
    borderRadius: 16,
    marginBottom: 16,
    padding: 10,
  },
  cardImageWrapper: {
    width: '100%',
    aspectRatio: 1, // Square
    borderRadius: 16,
    backgroundColor: '#1A2A2A',
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
    backgroundColor: '#0F1F1F',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: Colors.elmo.accent,
  },
  cardHeaderTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  trafficRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444', // Red
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trafficInfo: {
    flex: 1,
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  alertDistance: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  alertDelay: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#0F1F1F',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  shortcutTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shortcutAddress: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  shortcutDistance: {
    color: '#AAAAAA', // Or maybe accent color if we want to highlight it
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
  },
  // Detail View Styles
  detailHeader: {
    height: 200,
    marginBottom: 0,
    position: 'relative',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#27272A',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    // shadow for consistency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  detailImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  detailName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailAddress: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  badgesWrapper: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
    // justifyContent: 'space-between', // Removed for pills
  },
  preferenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#000',
  },
  preferenceBadgeActive: {
    backgroundColor: 'rgba(64, 224, 208, 0.1)', // Subtle mint tint
    borderColor: Colors.elmo.accent,
  },
  preferenceText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  preferenceTextActive: {
    color: Colors.elmo.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  badgeFast: {
    backgroundColor: '#000', // Black as requested (dark capsule)
    borderWidth: 0.5,
    borderColor: Colors.elmo.accent, // Mint,
  },
  badgeEconomic: {
    backgroundColor: '#000', // Black as requested (dark capsule)
    borderWidth: 0.5,

  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  startNavButton: {
    backgroundColor: Colors.elmo.accent,
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row', // Align icon and text
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  startNavText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Saved Locations Styles
  savedLocationsList: {
    marginTop: 0,
  },
  savedLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  savedIconContainer: {
    marginRight: 16,
    // No background as requested, just icon
  },
  savedTextStack: {
    flex: 1,
  },
  savedLocationName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  savedLocationAddress: {
    color: '#A0A0A0', // Grey as requested
    fontSize: 13,
    marginTop: 2,
  },
  iconContainer: {
    marginBottom: 12,
  }
});
