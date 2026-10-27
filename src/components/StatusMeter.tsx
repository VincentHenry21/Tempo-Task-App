import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

interface StatusMeterProps {
  ratio: number;
  subtitle: string;
  title: string;
}

export function StatusMeter({ ratio, subtitle, title }: StatusMeterProps): React.JSX.Element {
  const { colors } = useTheme();
  const percent = Math.round(ratio * 100);
  const width = 280;
  const height = 56;
  const x = 10 + ratio * (width - 20);
  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={[typography.sectionTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[typography.body, { color: '#FFFFFF', fontWeight: '600' }]}>{percent}%</Text>
        </View>
      </View>
      <Svg height={height} width={width}>
        <Line stroke={colors.chartIdle} strokeWidth={2} x1={10} x2={width - 10} y1={20} y2={20} />
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <Line
            key={tick}
            stroke={colors.textSecondary}
            strokeWidth={2}
            x1={10 + tick * (width - 20)}
            x2={10 + tick * (width - 20)}
            y1={14}
            y2={26}
          />
        ))}
        <Line stroke={colors.primary} strokeLinecap="round" strokeWidth={4} x1={10} x2={x} y1={20} y2={20} />
        <Path
          d={`M ${x - 8} 30 L ${x} 44 L ${x + 8} 30 Z`}
          fill={colors.primary}
        />
      </Svg>
      <Text style={[typography.small, { color: colors.textSecondary }]}>
        {percent}% of this week&apos;s tasks are complete.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
