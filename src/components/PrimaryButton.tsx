import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { GlassSurface } from './GlassSurface';

interface PrimaryButtonProps {
  accessibilityLabel: string;
  disabled?: boolean;
  labelColor?: string;
  onPress: () => void;
  style?: ViewStyle;
  title: string;
  variant?: 'primary' | 'outline';
}

export function PrimaryButton({
  accessibilityLabel,
  disabled,
  labelColor,
  onPress,
  style,
  title,
  variant = 'primary',
}: PrimaryButtonProps): React.JSX.Element {
  const { colors, glass } = useTheme();
  const handlePress = (): void => {
    if (disabled) {
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  const tint = variant === 'primary' ? glass.tintBlue : undefined;
  const textColor = labelColor ?? (variant === 'primary' ? '#FFFFFF' : colors.text);
  return (
    <GlassSurface
      accessibilityLabel={accessibilityLabel}
      onPress={disabled ? undefined : handlePress}
      radius={999}
      style={[disabled ? { opacity: 0.5 } : null, style]}
      tint={tint}
    >
      <View style={styles.button}>
        <Text style={[styles.label, { color: textColor }]}>{title}</Text>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
