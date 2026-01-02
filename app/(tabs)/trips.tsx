import { StyleSheet, View, TouchableOpacity, FlatList, Text } from 'react-native';
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { Colors } from '@/constants/theme';
import TripHeader from '@/components/trips/TripHeader';
import HistoryTripCard from '@/components/trips/HistoryTripCard';
import UpcomingTripCard from '@/components/trips/UpcomingTripCard';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const INITIAL_OFFSET = 1200;

// Dummy Data
const HISTORY_TRIPS = [
  {
    id: '5',
    date: { month: 'JUN', day: '05' },
    city: 'Lugano',
    distance: '92.1km',
    trackImage: require('../../assets/images/Percorso Arona.jpg'),
    images: [
      'https://picsum.photos/seed/trip5a/200/200',
      'https://picsum.photos/seed/trip5b/200/200',
      'https://picsum.photos/seed/trip5c/200/200',
      'https://picsum.photos/seed/trip5d/200/200',
    ],
    friends: [
      'https://picsum.photos/seed/user8/100',
      'https://picsum.photos/seed/user9/100',
    ]
  },
  {
    id: '4',
    date: { month: 'JUL', day: '10' },
    city: 'Varese',
    distance: '45.8km',
    trackImage: require('../../assets/images/Percorso lecco.jpg'),
    images: [
      'https://picsum.photos/seed/trip4a/200/200',
      'https://picsum.photos/seed/trip4b/200/200',
    ],
    friends: [
      'https://picsum.photos/seed/user1/100',
      'https://picsum.photos/seed/user3/100',
      'https://picsum.photos/seed/user7/100',
    ]
  },
  {
    id: '3',
    date: { month: 'AUG', day: '22' },
    city: 'Como',
    distance: '65.2km',
    trackImage: require('../../assets/images/Percorso Arona.jpg'),
    images: [
      'https://picsum.photos/seed/trip3a/200/200',
      'https://picsum.photos/seed/trip3b/200/200',
      'https://picsum.photos/seed/trip3c/200/200',
    ],
    friends: [
      'https://picsum.photos/seed/user2/100',
      'https://picsum.photos/seed/user6/100',
    ]
  },
  {
    id: '2',
    date: { month: 'SEP', day: '15' },
    city: 'Lecco',
    distance: '89.4km',
    trackImage: require('../../assets/images/Percorso lecco.jpg'),
    images: [
      'https://picsum.photos/seed/trip2a/200/200',
    ],
    friends: [
      'https://picsum.photos/seed/user4/100',
      'https://picsum.photos/seed/user5/100',
    ]
  },
  {
    id: '1',
    date: { month: 'OCT', day: '07' },
    city: 'Arona',
    distance: '153.1km',
    trackImage: require('../../assets/images/Percorso Arona.jpg'),
    images: [
      'https://picsum.photos/seed/trip1a/200/200',
      'https://picsum.photos/seed/trip1b/200/200',
      'https://picsum.photos/seed/trip1c/200/200',
      'https://picsum.photos/seed/trip1d/200/200',
      'https://picsum.photos/seed/trip1e/200/200',
      'https://picsum.photos/seed/trip1f/200/200',
      'https://picsum.photos/seed/trip1g/200/200',
      'https://picsum.photos/seed/trip1h/200/200',
      'https://picsum.photos/seed/trip1i/200/200',
      'https://picsum.photos/seed/trip1j/200/200',
      'https://picsum.photos/seed/trip1k/200/200',
    ],
    friends: [
      'https://picsum.photos/seed/user1/100',
      'https://picsum.photos/seed/user2/100',
      'https://picsum.photos/seed/user3/100',
    ]
  },
];

const UPCOMING_TRIPS = [
  {
    id: '3',
    date: { month: 'DEC', day: '03' },
    city: 'Monte Bianco',
    daysLeft: 5,
    time: '10:30',
    distance: '113.8km',
    image: require('../../assets/images/monte bianco.jpg'),
    friends: [
      'https://picsum.photos/seed/user6/100',
      'https://picsum.photos/seed/user7/100',
      'https://picsum.photos/seed/user1/100',
      'https://picsum.photos/seed/user2/100',
    ]
  },
  {
    id: '4',
    date: { month: 'JAN', day: '12' },
    city: 'Cortina',
    daysLeft: 45,
    time: '08:00',
    distance: '320.5km',
    image: 'https://picsum.photos/seed/snow/300/300',
    friends: [
      'https://picsum.photos/seed/user3/100',
      'https://picsum.photos/seed/user4/100',
      'https://picsum.photos/seed/user5/100',
      'https://picsum.photos/seed/user3/100'
    ]
  }
];

export default function TripsScreen() {
  const router = useRouter(); // Initialize router
  const upcomingTrip = UPCOMING_TRIPS[0];
  const scrollY = useSharedValue(0);

  // State for dynamic date
  const [currentDate, setCurrentDate] = useState(`${HISTORY_TRIPS[0].date.day} ${HISTORY_TRIPS[0].date.month} 2025`);

  const flatListRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    // Initial scroll to focus on Upcoming section
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: INITIAL_OFFSET, animated: false });
      }
    }, 50);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const historyTitleStyle = useAnimatedStyle(() => {
    return { opacity: 1 };
  });

  const upcomingTitleStyle = useAnimatedStyle(() => {
    return { opacity: 1 };
  });

  // Viewability Config for Date Update
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      // Find the first visible item that is a history trip (has date)
      const visibleTrip = viewableItems.find(item => item.item.date);
      if (visibleTrip) {
        const { day, month } = visibleTrip.item.date;
        setCurrentDate(`${day} ${month} 2025`);
      }
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Update when 50% visible
    minimumViewTime: 0,
  };

  return (
    <View style={styles.container}>
      <TripHeader />

      <View style={{ flex: 1, position: 'relative' }}>
        <LinearGradient
          colors={[Colors.elmo.background, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0.6, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 65,
            zIndex: 1,
          }}
          pointerEvents="none"
        />
        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <Animated.Text style={[styles.sectionTitle, historyTitleStyle]}>History</Animated.Text>
            <Text style={styles.headerDateText}>{currentDate}</Text>
          </View>
        </View>

        <Animated.FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          data={HISTORY_TRIPS}
          renderItem={({ item }) => (
            <HistoryTripCard
              date={item.date}
              city={item.city}
              distance={item.distance}
              trackImage={item.trackImage}
              images={item.images}
              friends={item.friends}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={() => (
            <View>
              <View style={styles.sectionUpcoming}>
                <Animated.Text style={[styles.sectionTitle, upcomingTitleStyle, { marginLeft: 20, marginBottom: 16 }]}>Upcoming</Animated.Text>
                <View style={styles.upcomingCardWrapper}>
                  <UpcomingTripCard
                    key={upcomingTrip.id}
                    date={upcomingTrip.date}
                    city={upcomingTrip.city}
                    daysLeft={upcomingTrip.daysLeft}
                    time={upcomingTrip.time}
                    distance={upcomingTrip.distance}
                    image={upcomingTrip.image}
                    friends={upcomingTrip.friends}
                    highlighted={true}
                  />
                </View>
              </View>
              <View style={{ height: 100 }} />
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/add-trip-selection')}
      >
        <Ionicons name="add" size={24} color="#000" style={styles.fabIcon} />
        <Animated.Text style={styles.fabText}>Add Trip</Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.elmo.background,
    position: 'relative',
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 60,
  },
  headerContainer: {
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 20,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '500',
    // Removed margins as they are handled by container/row
  },
  headerDateText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  sectionUpcoming: {
    marginBottom: 10,
    marginTop: 24,
  },
  upcomingCardWrapper: {
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: Colors.elmo.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fabIcon: {
    fontWeight: 'bold',
  },
  fabText: {
    color: '#000',
    fontWeight: 'normal',
    fontSize: 16,
  },
});
