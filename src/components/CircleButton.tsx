import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { GlassSurface } from './GlassSurface';
import { Icon, type IconName } from './Icon';

interface CircleButtonProps {
  accessibilityLabel: string;
  badge?: boolean;
  icon: IconName;
  onPress: () => void;
  style?: ViewStyle;
  tone?: 'default' | 'dark' | 'lime';
}

export function CircleButton({ accessibilityLabel, badge, icon, onPress, style, tone = 'default' }: CircleButtonProps): React.JSX.Element {
  const { colors, glass } = useTheme();
  const tint = tone === 'dark' ? 'rgba(17,20,28,0.72)' : tone === 'lime' ? glass.tintLime : undefined;
  const iconColor = tone === 'dark' ? '#FFFFFF' : colors.text;
  const handlePress = (): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <GlassSurface accessibilityLabel={accessibilityLabel} onPress={handlePress} radius={22} style={style} tint={tint}>
      <View style={styles.button}>
        <Icon color={iconColor} name={icon} size={20} />
        {badge ? <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: glass.border }]} /> : null}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 2,
    height: 10,
    position: 'absolute',
    right: 8,
    top: 8,
    width: 10,
  },
  button: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
