import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeTabs
      blurEffect="systemMaterial"
      backgroundColor="transparent"
      shadowColor="transparent"
      iconColor={{
        selected: Colors[colorScheme ?? 'light'].tint,
      }}
      labelStyle={{
        selected: {
          color: Colors[colorScheme ?? 'light'].tint,
        },
      }}>
      <NativeTabs.Trigger
        name="index"
        options={{
          title: 'Home',
          icon: { sf: 'house.fill' },
        }}
      />
      <NativeTabs.Trigger
        name="trips"
        options={{
          title: 'Trips',
          icon: { sf: 'map.fill' },
        }}
      />
      <NativeTabs.Trigger
        name="car"
        options={{
          title: 'Car',
          icon: { sf: 'car.fill' },
        }}
      />
    </NativeTabs>
  );
}
