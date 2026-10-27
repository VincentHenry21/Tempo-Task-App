import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

function hasNativeGlass(): boolean {
  try {
    return Platform.OS === 'ios' && isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

interface GlassSurfaceProps {
  accessibilityLabel?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  radius?: number;
  strong?: boolean;
  style?: StyleProp<ViewStyle>;
  tint?: string;
}

export function GlassSurface({
  accessibilityLabel,
  children,
  onPress,
  radius = 24,
  strong,
  style,
  tint,
}: GlassSurfaceProps): React.JSX.Element {
  const { glass, isDark, reduceTransparency } = useTheme();
  const native = hasNativeGlass();
  const fill = tint ?? (strong || reduceTransparency ? glass.fillStrong : glass.fill);
  const shell: ViewStyle = {
    borderRadius: radius,
    overflow: 'hidden',
    shadowColor: glass.shadow,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: glass.shadowOpacity,
    shadowRadius: 24,
  };
  const inner = native ? (
    <GlassView glassEffectStyle="regular" style={{ borderRadius: radius }} tintColor={tint}>
      {children}
    </GlassView>
  ) : (
    <BlurView intensity={glass.blur} tint={isDark ? 'dark' : 'light'}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
      <LinearGradient
        colors={[glass.highlight, 'rgba(255,255,255,0)']}
        end={{ x: 0, y: 0.6 }}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderColor: glass.border, borderRadius: radius, borderWidth: StyleSheet.hairlineWidth * 2 },
        ]}
      />
      {children}
    </BlurView>
  );
  if (!onPress) {
    return <View style={[shell, style]}>{inner}</View>;
  }
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [shell, style, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      {inner}
    </Pressable>
  );
}
