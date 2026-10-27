import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { GlassSurface } from '../../src/components/GlassSurface';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { TaskTile } from '../../src/components/TaskTile';
import { WeekBarChart } from '../../src/components/WeekBarChart';
import { useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';

const LABELS = ['Design', 'Development', 'Bug', 'Review'] as const;

export default function Planner(): React.JSX.Element {
  const { colors } = useTheme();
  const { stats, tasks } = useTasks();
  const router = useRouter();
  const upcoming = tasks
    .filter((task) => task.status === 'open')
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
    .slice(0, 6);

  return (
    <ScreenContainer>
      <Text style={[typography.sectionTitle, { color: colors.text }]}>Planner</Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6 }]}>
        Your week at a glance, computed from your tasks.
      </Text>
      <View style={styles.grid}>
        <Card style={styles.stat}>
          <Text style={[typography.bigNumber, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Total tasks</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={[typography.bigNumber, { color: colors.text }]}>{stats.pending}</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Pending</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={[typography.bigNumber, { color: colors.text }]}>{Math.round(stats.completedRatio * 100)}%</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Complete</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={[typography.bigNumber, { color: colors.text }]}>{stats.totalHoursThisMonth.toFixed(0)}h</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Hours this month</Text>
        </Card>
      </View>
      <Card style={styles.chartCard}>
        <WeekBarChart hours={stats.hoursPerWeekday} totalHours={stats.totalHoursThisMonth} />
      </Card>
      <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24 }]}>Tasks by label</Text>
      <GlassSurface radius={24} style={styles.listGlass}>
        <View style={styles.listInner}>
          {LABELS.map((label) => (
            <View key={label} style={[styles.labelRow, { borderColor: colors.divider }]}>
              <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>{label}</Text>
              <Text style={[typography.body, { color: colors.textSecondary }]}>{stats.perLabelCounts[label]} tasks</Text>
            </View>
          ))}
        </View>
      </GlassSurface>
      <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24 }]}>Up next</Text>
      {upcoming.length === 0 ? (
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>Nothing upcoming. You are clear.</Text>
      ) : (
        <GlassSurface radius={24} style={styles.listGlass}>
          <View style={styles.listInner}>
            {upcoming.map((task) => (
              <TaskTile key={task.id} onPress={() => router.push(`/task/${task.id}` as never)} task={task} />
            ))}
          </View>
        </GlassSurface>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  labelRow: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  listGlass: {
    marginTop: 12,
  },
  listInner: {
    padding: 8,
  },
  stat: {
    minWidth: '47%',
    flex: 1,
  },
});
