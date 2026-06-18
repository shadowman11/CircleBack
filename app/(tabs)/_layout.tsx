import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#888888",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#171717fa',
          height: 60,
          paddingHorizontal: 10,
          borderTopWidth: 0,
        },
      }}>
      <Tabs.Screen
        name="timer"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'time-sharp' : 'time-outline'} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
