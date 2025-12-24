import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import TripHeader from '@/components/trips/TripHeader';
import HistoryTripCard from '@/components/trips/HistoryTripCard';
import UpcomingTripCard from '@/components/trips/UpcomingTripCard';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

// Dummy Data
const HISTORY_TRIPS = [
  {
    id: '1',
    date: { month: 'OCT', day: '07' },
    city: 'Arona',
    distance: '153.1km',
    trackImage: require('../../assets/images/Percorso Arona.jpg'),
    images: [
      'https://picsum.photos/seed/trip1a/200/200',
      'https://picsum.photos/seed/trip1b/200/200',
    ],
    friends: [
      'https://picsum.photos/seed/user1/100',
      'https://picsum.photos/seed/user2/100',
      'https://picsum.photos/seed/user3/100',
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
  }
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
    ]
  }
];

export default function TripsScreen() {
  const upcomingTrip = UPCOMING_TRIPS[0];
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Keep titles visible (removed opacity animations as per previous state)
  const historyTitleStyle = useAnimatedStyle(() => {
    return { opacity: 1 };
  });

  const upcomingTitleStyle = useAnimatedStyle(() => {
    return { opacity: 1 };
  });

  return (
    <View style={styles.container}>
      <TripHeader />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]} // Index 1 is History Header (after Spacer)
        showsVerticalScrollIndicator={true}
      >
        {/* Spacer at the beginning to push content down slightly if requested, or just top padding */}
        <View style={{ height: 20 }} />

        {/* History Title - Sticky (Index 1) */}
        <View style={styles.headerContainer}>
          <Animated.Text style={[styles.sectionTitle, historyTitleStyle]}>History</Animated.Text>
        </View>

        {/* History Items */}
        <View style={styles.sectionHistory}>
          {HISTORY_TRIPS.map((trip) => (
            <HistoryTripCard
              key={trip.id}
              date={trip.date}
              city={trip.city}
              distance={trip.distance}
              trackImage={trip.trackImage}
              images={trip.images}
              friends={trip.friends}
            />
          ))}
        </View>

        {/* Upcoming Section (Bottom) */}
        <View style={styles.sectionUpcoming}>
          <Animated.Text style={[styles.sectionTitle, upcomingTitleStyle]}>Upcoming</Animated.Text>
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

        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 150 }} />

      </Animated.ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: Colors.elmo.background,
    paddingVertical: 8,
    zIndex: 10,
  },
  sectionTitle: {
    color: Colors.elmo.text,
    fontSize: 27,
    fontFamily: 'serif',
    fontWeight: 'normal',
    marginLeft: 20,
    marginBottom: 24,
  },
  sectionHistory: {
    marginBottom: 20,
  },
  sectionUpcoming: {
    marginBottom: 10,
    marginTop: 20, // Increased spacing
  },
  upcomingCardWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 100, // Adjusted to float above tab bar
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
    flexDirection: 'row', // Align icon and text
    alignItems: 'center',
    gap: 8, // Space between icon and text
  },
  fabIcon: {
    fontWeight: 'bold',
  },
  fabText: {
    color: '#000',
    fontWeight: 'regular',
    fontSize: 16,
  }
});
