import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, useColorScheme } from 'react-native';
import {
  ambientDark,
  ambientLight,
  darkColors,
  glassDark,
  glassLight,
  lightColors,
  type AmbientTokens,
  type GlassTokens,
  type ThemeColors,
} from './colors';
import { getStoredValue, setStoredValue, THEME_KEY } from '../services/storage';
import type { ThemeMode } from '../types';

interface ThemeContextValue {
  ambient: AmbientTokens;
  colors: ThemeColors;
  glass: GlassTokens;
  isDark: boolean;
  mode: ThemeMode;
  reduceTransparency: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  ambient: ambientLight,
  colors: lightColors,
  glass: glassLight,
  isDark: false,
  mode: 'system',
  reduceTransparency: false,
  setMode: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [reduceTransparency, setReduceTransparency] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const firstScheme = useRef(true);

  useEffect(() => {
    let mounted = true;
    getStoredValue(THEME_KEY).then((stored) => {
      if (mounted && (stored === 'system' || stored === 'light' || stored === 'dark')) {
        setModeState(stored);
      }
    });
    // isReduceTransparencyEnabled is iOS-only: react-native-web does not
    // implement it, and calling it unguarded crashes the whole web app at
    // startup. Feature-detect so native behavior is unchanged and web
    // simply keeps reduceTransparency false.
    AccessibilityInfo.isReduceTransparencyEnabled?.()
      .then((value) => {
        if (mounted) {
          setReduceTransparency(value);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const resolved = mode === 'system' ? systemScheme : mode;
  const isDark = resolved === 'dark';

  useEffect(() => {
    if (firstScheme.current) {
      firstScheme.current = false;
      return;
    }
    fade.setValue(0.6);
    Animated.timing(fade, { duration: 250, toValue: 1, useNativeDriver: true }).start();
  }, [fade, isDark]);

  const setMode = (next: ThemeMode): void => {
    setModeState(next);
    void setStoredValue(THEME_KEY, next);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      ambient: isDark ? ambientDark : ambientLight,
      colors: isDark ? darkColors : lightColors,
      glass: isDark ? glassDark : glassLight,
      isDark,
      mode,
      reduceTransparency,
      setMode,
    }),
    [isDark, mode, reduceTransparency],
  );

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View style={{ flex: 1, opacity: fade }}>{children}</Animated.View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
