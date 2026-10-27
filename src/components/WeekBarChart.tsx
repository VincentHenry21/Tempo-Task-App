import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

interface WeekBarChartProps {
  hours: number[];
  totalHours: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TICKS = [8, 6, 4, 2, 1];

export function WeekBarChart({ hours, totalHours }: WeekBarChartProps): React.JSX.Element {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(0);
  const max = 8;
  const chartHeight = 120;
  const barWidth = 26;
  const gap = 18;
  const width = DAYS.length * (barWidth + gap) + 30;
  const selectedHours = hours[selected] ?? 0;
  return (
    <View>
      <View style={styles.header}>
        <Text style={[typography.sectionTitle, { color: colors.text }]}>Monthly Working Hours</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>{totalHours.toFixed(0)}h total</Text>
      </View>
      <View style={styles.chartRow}>
        <View style={styles.yAxis}>
          {TICKS.map((tick) => (
            <Text key={tick} style={[typography.small, { color: colors.textSecondary }]}>
              {tick} hr
            </Text>
          ))}
        </View>
        <Svg height={chartHeight + 24} width={width}>
          {hours.map((value, index) => {
            const height = Math.max(6, (value / max) * chartHeight);
            const x = 8 + index * (barWidth + gap);
            const y = chartHeight - height;
            const active = index === selected;
            return (
              <React.Fragment key={DAYS[index]}>
                {active ? (
                  <React.Fragment>
                    <Rect
                      fill={colors.limeStrong}
                      height={18}
                      rx={9}
                      stroke={colors.textSecondary}
                      strokeOpacity={0.4}
                      strokeWidth={1}
                      width={58}
                      x={x + barWidth / 2 - 29}
                      y={Math.max(0, y - 26)}
                    />
                    <SvgText fill={colors.text} fontSize="11" fontWeight="600" textAnchor="middle" x={x + barWidth / 2} y={Math.max(13, y - 13)}>
                      {value.toFixed(1)} hrs
                    </SvgText>
                  </React.Fragment>
                ) : null}
                <Rect
                  fill={active ? colors.primary : colors.chartIdle}
                  height={height}
                  rx={8}
                  width={barWidth}
                  x={x}
                  y={y}
                />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
      <View style={styles.labels}>
        {DAYS.map((day, index) => (
          <Pressable
            key={day}
            accessibilityLabel={`${day}: ${hours[index]?.toFixed(1) ?? '0'} hours`}
            accessibilityRole="button"
            onPress={() => setSelected(index)}
            style={[styles.labelButton, { width: barWidth + gap }]}
          >
            <Text style={[typography.small, { color: index === selected ? colors.text : colors.textSecondary }]}>{day}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[typography.small, { color: colors.textSecondary, marginTop: 8 }]}>
        Selected: {DAYS[selected]} · {selectedHours.toFixed(1)} hours
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chartRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelButton: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  labels: {
    flexDirection: 'row',
    marginLeft: 37,
  },
  yAxis: {
    height: 120,
    justifyContent: 'space-between',
    marginRight: 8,
    width: 30,
  },
});
