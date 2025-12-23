
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import TripHeader from '@/components/trips/TripHeader';
import HistoryTripCard from '@/components/trips/HistoryTripCard';
import UpcomingTripCard from '@/components/trips/UpcomingTripCard';

// Dummy Data
const HISTORY_TRIPS = [
  {
    id: '1',
    date: { month: 'OCT', day: '07' },
    city: 'Arona',
    distance: '153.1km',
    trackImage: 'https://picsum.photos/seed/map1/200/200', // Placeholder for map
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
    city: 'Lugano',
    distance: '89.4km',
    trackImage: 'https://picsum.photos/seed/map2/200/200',
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
    city: 'Venice',
    daysLeft: 5,
    time: '10:30',
    distance: '113.8km',
    image: 'https://picsum.photos/seed/venice/300/300',
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
    ]
  }
];

export default function TripsScreen() {
  const upcomingTrip = UPCOMING_TRIPS[0];

  return (
    <View style={styles.container}>
      <TripHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >

        {/* History Title - Sticky (Index 0) */}
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>History</Text>
        </View>

        {/* History Items (Index 1) */}
        <View style={styles.sectionContent}>
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

        {/* Upcoming Section (Index 2) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {/* Only showing first trip, highlighted */}
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

        {/* Bottom Padding for Tab Bar and FAB */}
        <View style={{ height: 120 }} />

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Text style={styles.fabText}>ADD TRIP</Text>
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
    paddingTop: 0,
  },
  headerContainer: {
    backgroundColor: Colors.elmo.background,
    paddingVertical: 10,
    zIndex: 10,
  },
  sectionTitle: {
    color: Colors.elmo.text,
    fontSize: 27,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  sectionContent: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: Colors.elmo.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
  fabText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
