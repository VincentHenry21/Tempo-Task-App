import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassIcon } from '../../src/components/GlassIcon';
import { GlassSurface } from '../../src/components/GlassSurface';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { tasksForDate, useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';

const HOURS = Array.from({ length: 17 }, (_, index) => 6 + index);

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function label(hour: number): string {
  if (hour === 12) {
    return '12:00 PM';
  }
  if (hour > 12) {
    return `${hour - 12}:00 PM`;
  }
  return `${hour}:00 AM`;
}

function labelTint(label: string, colors: { danger: string; limeStrong: string; primary: string }): string {
  const base =
    label === 'Design'
      ? colors.primary
      : label === 'Development'
        ? colors.limeStrong
        : label === 'Bug'
          ? colors.danger
          : '#A78BFA';
  return base.length === 7 ? `${base}B3` : base;
}

export default function Schedule(): React.JSX.Element {
  const { colors } = useTheme();
  const { tasks } = useTasks();
  const router = useRouter();
  const [day, setDay] = useState(new Date());
  const dateKey = iso(day);
  const dayTasks = useMemo(() => tasksForDate(tasks, dateKey), [dateKey, tasks]);
  const dayLabel = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', weekday: 'long', year: 'numeric' });

  const shiftDay = (delta: number): void => {
    const next = new Date(day);
    next.setDate(next.getDate() + delta);
    setDay(next);
  };

  return (
    <ScreenContainer>
      <Text style={[typography.sectionTitle, { color: colors.text }]}>Schedule</Text>
      <View style={styles.dayNav}>
        <GlassIcon accessibilityLabel="Previous day" icon="chevron-back-outline" onPress={() => shiftDay(-1)} />
        <Text style={[typography.body, { color: colors.text, fontWeight: '600', textAlign: 'center' }]}>{dayLabel}</Text>
        <GlassIcon accessibilityLabel="Next day" icon="chevron-forward-outline" onPress={() => shiftDay(1)} />
      </View>
      {HOURS.map((hour) => {
        const hourTasks = dayTasks.filter((task) => Number(task.startTime.split(':')[0]) === hour);
        return (
          <View key={hour} style={styles.hourRow}>
            <Text style={[typography.small, { color: colors.textSecondary, width: 74 }]}>{label(hour)}</Text>
            <View style={[styles.slot, { borderColor: colors.divider }]}>
              {hourTasks.length === 0 ? (
                <Pressable
                  accessibilityLabel={`Add a task at ${label(hour)}`}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      params: { date: dateKey, startTime: `${String(hour).padStart(2, '0')}:00` },
                      pathname: '/new-task',
                    } as never)
                  }
                  style={styles.freeSlot}
                >
                  <Text style={[typography.small, { color: colors.textSecondary }]}>Free time · tap to add a task</Text>
                </Pressable>
              ) : (
                hourTasks.map((task) => (
                  <GlassSurface
                    key={task.id}
                    accessibilityLabel={`Open ${task.title}`}
                    onPress={() => router.push(`/task/${task.id}` as never)}
                    radius={14}
                    style={styles.taskBlock}
                    tint={labelTint(task.label, colors)}
                  >
                    <View style={styles.taskBlockInner}>
                      <Text
                        numberOfLines={1}
                        style={[
                          typography.body,
                          { color: task.label === 'Design' || task.label === 'Bug' ? '#FFFFFF' : colors.text, fontWeight: '600' },
                        ]}
                      >
                        {task.title}
                      </Text>
                      <Text
                        style={[
                          typography.small,
                          { color: task.label === 'Design' || task.label === 'Bug' ? '#D6E2FF' : colors.textSecondary },
                        ]}
                      >
                        {task.startTime} - {task.endTime} · {task.label}
                      </Text>
                    </View>
                  </GlassSurface>
                ))
              )}
            </View>
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  dayNav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  freeSlot: {
    minHeight: 44,
    justifyContent: 'center',
  },
  hourRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  navButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  slot: {
    borderLeftWidth: 1,
    flex: 1,
    minHeight: 56,
    paddingLeft: 12,
    paddingVertical: 6,
  },
  taskBlock: {
    marginBottom: 6,
  },
  taskBlockInner: {
    padding: 10,
  },
});
