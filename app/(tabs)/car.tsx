import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import TripHeader from '@/components/trips/TripHeader';

const { width } = Dimensions.get('window');

const MINT_COLOR = '#40E0D0';

export default function CarScreen() {
  const renderBatteryBar = () => {
    return (
      <View style={styles.batteryBarContainer}>
        {[...Array(12)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.batterySegment,
              { backgroundColor: index < 8 ? MINT_COLOR : 'rgba(255, 255, 255, 0.2)' }
            ]}
          />
        ))}
      </View>
    );
  };

  const [climateOn, setClimateOn] = React.useState(true);
  const [emergencyOn, setEmergencyOn] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);


  return (
    <View style={styles.container}>
      <TripHeader />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.garageLabel}>My Garage</Text>
          <Image
            source={require('../../assets/images/car.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Text style={styles.timestampLabel}>Oggi, 12:40</Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.modelName}>Italdesign Asso</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Ionicons name="battery-charging-outline" size={20} color={MINT_COLOR} />
              <Text style={styles.statusText}>750 km / 81%</Text>
            </View>
            {renderBatteryBar()}
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Ionicons name="speedometer-outline" size={20} color="#888" />
              <Text style={[styles.statusText, { color: '#888' }]}>24.504 km</Text>
            </View>
          </View>
        </View>

        {/* Map Card */}
        <View style={styles.mapCard}>
          <View style={styles.mapContainer}>
            {/* Using Navigation Image Placeholder as MapView might require config */}
            <Image
              source={require('../../assets/images/background map.jpg')}
              style={styles.mapImage}
              resizeMode="cover"
            />

            {/* Floating Marker Label (Simulated) */}
            <View style={styles.floatingLabel}>
              <Ionicons name="car" size={16} color={MINT_COLOR} />
              <Text style={styles.floatingLabelText}>760m / 11min</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.8}>
            <Ionicons name="walk-outline" size={24} color="#000" />
            <Text style={styles.navButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>

        {/* Remote Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.controlsTitle}>Remote Controls</Text>

          <View style={styles.controlsGrid}>
            {/* Climate Button */}
            <TouchableOpacity
              style={[styles.controlButton, climateOn && styles.controlButtonActive]}
              activeOpacity={0.8}
              onPress={() => setClimateOn(!climateOn)}
            >
              <MaterialCommunityIcons
                name="fan"
                size={32}
                color={climateOn ? MINT_COLOR : "#FFF"}
              />
              <Text style={climateOn ? styles.controlTextActive : styles.controlText}>Climate</Text>
            </TouchableOpacity>

            {/* Emergency Lights Button */}
            <TouchableOpacity
              style={[styles.controlButton, emergencyOn && styles.controlButtonActive]}
              activeOpacity={0.8}
              onPress={() => setEmergencyOn(!emergencyOn)}
            >
              <Ionicons
                name="warning-outline"
                size={32}
                color={emergencyOn ? MINT_COLOR : "#FFF"}
              />
              <Text style={emergencyOn ? styles.controlTextActive : styles.controlText}>Emergency Lights</Text>
            </TouchableOpacity>

            {/* Lock/Unlock Door Button */}
            <TouchableOpacity
              style={[styles.controlButton, isLocked && styles.controlButtonActive]}
              activeOpacity={0.8}
              onPress={() => setIsLocked(!isLocked)}
            >
              <Ionicons
                name={isLocked ? "lock-closed-outline" : "lock-open-outline"}
                size={28}
                color={isLocked ? MINT_COLOR : "#FFF"}
              />
              <Text style={isLocked ? styles.controlTextActive : styles.controlText}>
                {isLocked ? "Unlock Door" : "Lock Door"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.elmo.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  garageLabel: {
    color: '#888',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },
  heroImage: {
    width: width - 40,
    height: 220,
    marginBottom: 10,
  },
  timestampLabel: {
    color: MINT_COLOR,
    fontSize: 16,
    fontWeight: '400',
  },

  // Status Section
  statusSection: {
    marginBottom: 30,
  },
  modelName: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '500',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 140,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '300',
  },
  batteryBarContainer: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  batterySegment: {
    width: 6,
    height: 18,
    borderRadius: 2,
  },

  // Map Card
  mapCard: {
    backgroundColor: Colors.elmo.cardDark, // Slightly lighter than bg
    borderRadius: 45,
    overflow: 'hidden',
    marginBottom: 30,
  },
  mapContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  floatingLabel: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  floatingLabelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '300',
  },
  navButton: {
    backgroundColor: MINT_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  navButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },

  // Remote Controls
  controlsSection: {
    gap: 20,
  },
  controlsTitle: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 10,
  },
  controlButton: {
    width: (width - 60) / 3, // (screen width - padding(40) - gap(10*2)) / 3
    height: 100,
    borderRadius: 20,
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(64, 224, 208, 0.05)', // Very subtle tint
    borderColor: MINT_COLOR,
    shadowColor: MINT_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 2,
  },
  controlText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '400',
  },
  controlTextActive: {
    color: MINT_COLOR,
    fontSize: 13,
    fontWeight: '600',
  },
});
