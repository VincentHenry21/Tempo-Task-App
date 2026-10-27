import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { GlassSurface } from './GlassSurface';
import { Icon, type IconName } from './Icon';

interface GlassIconProps {
  accessibilityLabel: string;
  badge?: boolean;
  icon: IconName;
  iconColor?: string;
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
  tint?: string;
}

export function GlassIcon({
  accessibilityLabel,
  badge,
  icon,
  iconColor,
  onPress,
  size = 44,
  style,
  tint,
}: GlassIconProps): React.JSX.Element {
  const { glass } = useTheme();
  const inner = (
    <View style={[styles.circle, { height: size, width: size }]}>
      <Icon name={icon} size={22} color={iconColor} />
      {badge ? <View style={[styles.badge, { borderColor: glass.border }]} /> : null}
    </View>
  );
  if (!onPress) {
    return (
      <GlassSurface radius={size / 2} style={style} tint={tint}>
        {inner}
      </GlassSurface>
    );
  }
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.94 : 1 }] }, style]}
    >
      <GlassSurface radius={size / 2} tint={tint}>
        {inner}
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#4272FF',
    borderRadius: 999,
    borderWidth: 2,
    height: 10,
    position: 'absolute',
    right: 8,
    top: 8,
    width: 10,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
