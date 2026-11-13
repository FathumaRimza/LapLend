
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../components/theme';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import RentalsScreen from '../screens/RentalsScreen';
import ManageScreen from '../screens/ManageScreen';
import LaptopDetailsScreen from '../screens/LaptopDetailsScreen';
import RentScreen from '../screens/RentScreen';
import LaptopFormScreen from '../screens/LaptopFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.55 }}>
      {emoji}
    </Text>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: (e) => {
          console.log('Tab pressed:', e.target);
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#8792A5',

tabBarStyle: {
  backgroundColor: '#FFFFFF',
  borderTopColor: COLORS.border,
  height: 80,
  paddingBottom: 20,
  paddingTop: 8,
  elevation: 20,
  zIndex: 999,
},
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⌂" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Browse"
        component={CatalogScreen}
        options={{
          tabBarLabel: 'Laptops',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💻" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Rentals"
        component={RentalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Manage"
        component={ManageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="LaptopDetails" component={LaptopDetailsScreen} />
      <Stack.Screen name="RentLaptop" component={RentScreen} />
      <Stack.Screen name="LaptopForm" component={LaptopFormScreen} />
    </Stack.Navigator>
  );
}
