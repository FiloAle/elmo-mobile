import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image'; // If needed, or use Ionicons

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Icon Logic
          let iconName: keyof typeof Ionicons.glyphMap = 'help';
          if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
          if (route.name === 'trips') iconName = isFocused ? 'map' : 'map-outline';
          if (route.name === 'car') iconName = isFocused ? 'car' : 'car-outline';


          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? Colors.elmo.accent : '#A1A1AA'}
              />
              <Text style={{
                color: isFocused ? Colors.elmo.accent : '#A1A1AA',
                fontSize: 10,
                marginTop: 4,
                fontWeight: isFocused ? '600' : '400'
              }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
        }}
      />
      <Tabs.Screen
        name="car"
        options={{
          title: 'Car',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute items evenly
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 10, // Add padding to sides of the pill container
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    height: 70, // Fixed height for consistent look
  },
  tabItem: {
    flex: 1, // Share space equally
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.elmo.accent, // #2DD4BF
    borderRadius: 30, // Pill shape
    paddingVertical: 10,
    paddingHorizontal: 24, // Wide pill
    gap: 8,
    flexGrow: 0, // Don't enforce flex:1, let it size to content + padding
  },
  activePillText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
