import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';
import { GlassSurface } from './GlassSurface';
import { Icon } from './Icon';

interface CalendarGridProps {
  onSelectRange?: (start: string, end: string) => void;
  selectedEnd?: string | null;
  selectedStart?: string | null;
  tasksPerDate: Record<string, number>;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function CalendarGrid({ onSelectRange, selectedEnd, selectedStart, tasksPerDate }: CalendarGridProps): React.JSX.Element {
  const { colors, glass } = useTheme();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [start, setStart] = useState<string | null>(selectedStart ?? null);
  const [end, setEnd] = useState<string | null>(selectedEnd ?? null);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const result: Array<{ date: string; day: number; inMonth: boolean }> = [];
    for (let i = startDay - 1; i >= 0; i -= 1) {
      const day = daysInPrev - i;
      result.push({ date: iso(new Date(year, month - 1, day)), day, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      result.push({ date: iso(new Date(year, month, day)), day, inMonth: true });
    }
    while (result.length % 7 !== 0) {
      const day = result.length - (startDay + daysInMonth) + 1;
      result.push({ date: iso(new Date(year, month + 1, day)), day, inMonth: false });
    }
    return result;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleDay = (date: string): void => {
    if (!start || (start && end)) {
      setStart(date);
      setEnd(null);
      onSelectRange?.(date, date);
    } else if (date < start) {
      setStart(date);
      setEnd(start);
      onSelectRange?.(date, start);
    } else {
      setEnd(date);
      onSelectRange?.(start, date);
    }
  };

  const shiftMonth = (delta: number): void => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  };

  return (
    <GlassSurface radius={24} tint={glass.tintLime}>
      <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[typography.sectionTitle, { color: colors.text }]}>{monthLabel}</Text>
        <View style={styles.nav}>
          <Pressable
            accessibilityLabel="Previous month"
            accessibilityRole="button"
            onPress={() => shiftMonth(-1)}
            style={styles.navButton}
          >
            <Icon color={colors.text} name="chevron-back-outline" size={20} />
          </Pressable>
          <Pressable
            accessibilityLabel="Next month"
            accessibilityRole="button"
            onPress={() => shiftMonth(1)}
            style={styles.navButton}
          >
            <Icon color={colors.text} name="chevron-forward-outline" size={20} />
          </Pressable>
        </View>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={[styles.cellText, { color: colors.textSecondary }]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell) => {
          const isStart = start === cell.date;
          const isEnd = end === cell.date;
          const inRange = start !== null && end !== null && cell.date > start && cell.date < end;
          const isToday = cell.date === iso(today);
          const count = tasksPerDate[cell.date] ?? 0;
          const dots = Math.min(4, count);
          return (
            <Pressable
              key={cell.date}
              accessibilityLabel={`${cell.date}${count > 0 ? `, ${count} tasks` : ''}`}
              accessibilityRole="button"
              onPress={() => handleDay(cell.date)}
              style={[styles.cell, inRange ? { backgroundColor: glass.fill } : null]}
            >
              <View
                style={[
                  styles.dayBox,
                  isStart || isEnd ? { backgroundColor: colors.primary } : null,
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    {
                      color: isStart || isEnd ? '#FFFFFF' : cell.inMonth ? colors.text : colors.textSecondary,
                      textDecorationLine: isToday ? 'underline' : 'none',
                    },
                  ]}
                >
                  {cell.day}
                </Text>
              </View>
              <View style={styles.dots}>
                {Array.from({ length: dots }).map((_, index) => (
                  <View key={`${cell.date}-dot-${index}`} style={[styles.dot, { backgroundColor: colors.primary }]} />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  cell: {
    alignItems: 'center',
    paddingVertical: 2,
    width: '14.2857%',
  },
  cellText: {
    fontSize: 13,
    textAlign: 'center',
  },
  dayBox: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  dot: {
    borderRadius: 999,
    height: 4,
    marginHorizontal: 1,
    width: 4,
  },
  dots: {
    flexDirection: 'row',
    height: 8,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nav: {
    flexDirection: 'row',
  },
  navButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
});
