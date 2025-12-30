import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const MINT_COLOR = '#40E0D0';
const BG_COLOR = '#051616';

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          <Text style={styles.controlsTitle}>Controlli da remoto</Text>

          <View style={styles.controlsGrid}>
            {/* Active Button */}
            <TouchableOpacity style={[styles.controlButton, styles.controlButtonActive]} activeOpacity={0.8}>
              <MaterialCommunityIcons name="fan" size={32} color="#000" />
              <Text style={styles.controlTextActive}>Clima</Text>
            </TouchableOpacity>

            {/* Inactive Buttons */}
            <TouchableOpacity style={styles.controlButton} activeOpacity={0.8}>
              <Ionicons name="lock-closed-outline" size={28} color="#FFF" />
              <Text style={styles.controlText}>Blocco porte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} activeOpacity={0.8}>
              <Ionicons name="lock-open-outline" size={28} color="#FFF" />
              <Text style={styles.controlText}>Sblocco porte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} activeOpacity={0.8}>
              <Ionicons name="flash-outline" size={28} color="#FFF" />
              <Text style={styles.controlText}>Luci</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
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
    fontWeight: '500',
  },

  // Status Section
  statusSection: {
    marginBottom: 30,
  },
  modelName: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
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
    fontWeight: '500',
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
    backgroundColor: '#0F2525', // Slightly lighter than bg
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
    fontWeight: '600',
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
    fontWeight: 'bold',
  },

  // Remote Controls
  controlsSection: {
    gap: 20,
  },
  controlsTitle: {
    color: '#888',
    fontSize: 16,
    marginLeft: 4,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  controlButton: {
    width: (width - 55) / 2, // (screen width - padding(40) - gap(15)) / 2
    height: 110,
    borderRadius: 24,
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  },
  controlButtonActive: {
    backgroundColor: MINT_COLOR,
    borderColor: MINT_COLOR,
  },
  controlText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  controlTextActive: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
