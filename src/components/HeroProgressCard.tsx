import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radii } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';
import { GlassSurface } from './GlassSurface';
import { Icon } from './Icon';

interface HeroProgressCardProps {
  caption: string;
  completed: number;
  onPress: () => void;
  title: string;
  total: number;
}

export function HeroProgressCard({ caption, completed, onPress, title, total }: HeroProgressCardProps): React.JSX.Element {
  const { glass } = useTheme();
  const handlePress = (): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <GlassSurface accessibilityLabel={`${title}: ${completed} of ${total} tasks`} onPress={handlePress} radius={radii.hero} tint={glass.tintBlue}>
      <View style={styles.card}>
        <View style={styles.decoration} />
        <View style={styles.decorationTwo} />
        <View style={styles.topRow}>
          <Text style={[typography.sectionTitle, { color: '#FFFFFF' }]}>{title}</Text>
          <View style={[styles.arrow, { backgroundColor: glass.tintLime }]}>
            <Icon color="#111418" name="arrow-up-outline" size={20} />
          </View>
        </View>
        <Text style={[typography.bigNumber, { color: '#FFFFFF', marginTop: 12 }]}>
          {completed}/{total}
        </Text>
        <Text style={[typography.body, { color: '#D6E2FF', marginTop: 4 }]}>{caption}</Text>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  arrow: {
    alignItems: 'center',
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    width: 44,
  },
  card: {
    overflow: 'hidden',
    padding: 20,
  },
  decoration: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    height: 120,
    position: 'absolute',
    right: -30,
    top: -50,
    width: 120,
  },
  decorationTwo: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 999,
    height: 90,
    position: 'absolute',
    right: 60,
    top: 30,
    width: 90,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
