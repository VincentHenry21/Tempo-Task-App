import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AmbientBackground } from '../src/components/AmbientBackground';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { TasksProvider } from '../src/context/TasksContext';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { welcomeGradient } from '../src/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

function Splash(): React.JSX.Element {
  return (
    <LinearGradient colors={[...welcomeGradient]} style={styles.splash}>
      <Text style={styles.splashText}>TEMPO</Text>
    </LinearGradient>
  );
}

function RootNavigation(): React.JSX.Element {
  const { isReady } = useAuth();
  const { isDark } = useTheme();
  if (!isReady) {
    return <Splash />;
  }
  return (
    <View style={styles.ambientRoot}>
      <AmbientBackground />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' }, headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="task/[id]" />
        <Stack.Screen name="new-task" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <TasksProvider>
              <RootNavigation />
            </TasksProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  ambientRoot: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  splash: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  splashText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 6,
  },
});
