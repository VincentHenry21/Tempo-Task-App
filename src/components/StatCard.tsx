import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radii } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';
import { GlassSurface } from './GlassSurface';
import { Icon } from './Icon';

interface StatCardProps {
  accessibilityLabel: string;
  caption: string;
  count: number;
  onPress?: () => void;
  tone: 'lime' | 'white';
}

export function StatCard({ accessibilityLabel, caption, count, onPress, tone }: StatCardProps): React.JSX.Element {
  const { colors, glass, isDark } = useTheme();
  const tint = tone === 'lime' ? glass.tintLime : undefined;
  const textColor = tone === 'lime' && !isDark ? '#111418' : colors.text;
  const subColor = tone === 'lime' && !isDark ? '#3D4A1F' : colors.textSecondary;
  const handlePress = (): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  return (
    <GlassSurface
      accessibilityLabel={accessibilityLabel}
      onPress={onPress ? handlePress : undefined}
      radius={radii.card}
      strong={tone === 'white'}
      style={styles.shell}
      tint={tint}
    >
      <View style={styles.card}>
        <Text style={[typography.bigNumber, { color: textColor }]}>{count}</Text>
        <Text style={[typography.body, { color: subColor, marginTop: 4 }]}>{caption}</Text>
        <View style={[styles.arrow, { backgroundColor: '#111418' }]}>
          <Icon color="#FFFFFF" name="arrow-up-outline" size={18} />
        </View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  arrow: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    marginTop: 16,
    transform: [{ rotate: '45deg' }],
    width: 36,
  },
  card: {
    padding: 16,
  },
  shell: {
    flex: 1,
  },
});
