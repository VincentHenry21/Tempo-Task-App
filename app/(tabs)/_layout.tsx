import { Tabs } from 'expo-router';
import React from 'react';
import { FloatingTabBar } from '../../src/components/FloatingTabBar';

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <FloatingTabBar />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="planner" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
