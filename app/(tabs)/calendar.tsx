import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../src/components/Avatar';
import { CalendarGrid } from '../../src/components/CalendarGrid';
import { Card } from '../../src/components/Card';
import { CircleButton } from '../../src/components/CircleButton';
import { GlassSurface } from '../../src/components/GlassSurface';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { StatusMeter } from '../../src/components/StatusMeter';
import { useAuth } from '../../src/context/AuthContext';
import { useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';

export default function Calendar(): React.JSX.Element {
  const { colors, glass } = useTheme();
  const { stats, tasks } = useTasks();
  const { user } = useAuth();
  const router = useRouter();
  const firstName = (user?.name ?? user?.login ?? 'there').split(' ')[0];
  const designOpen = tasks.filter((task) => task.label === 'Design' && task.status === 'open').length;
  const devOpen = tasks.filter((task) => task.label === 'Development' && task.status === 'open').length;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar imageUrl={user?.avatarUrl || undefined} name={user?.name ?? user?.login ?? 'Tempo'} />
          <View style={styles.greeting}>
            <Text style={[typography.greeting, { color: colors.textSecondary }]}>Hello</Text>
            <Text numberOfLines={1} style={[typography.name, { color: colors.text }]}>
              {firstName}!
            </Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <CircleButton accessibilityLabel="Search tasks" icon="search-outline" onPress={() => router.push('/(tabs)/tasks')} />
          <CircleButton accessibilityLabel="Notifications" icon="notifications-outline" onPress={() => router.push('/(tabs)/tasks')} />
        </View>
      </View>
      <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24 }]}>Track Your Task</Text>
      <View style={styles.calendarWrap}>
        <CalendarGrid tasksPerDate={stats.tasksPerDate} />
      </View>
      <Card style={styles.statusCard}>
        <StatusMeter ratio={stats.weeklyCompletedRatio} subtitle="Overall Performance this week" title="Working Status" />
      </Card>
      <View style={styles.tileRow}>
        <GlassSurface radius={24} style={styles.tile} tint={glass.tintBlue}>
          <View style={styles.tileInner}>
            <Text style={[typography.bigNumber, { color: '#FFFFFF' }]}>{stats.perLabelCounts.Design}</Text>
            <Text style={[typography.body, { color: '#D6E2FF' }]}>Design Task</Text>
            <Text style={[typography.small, { color: '#FFFFFF', marginTop: 8 }]}>
              Status : {designOpen > 0 ? 'Working' : 'Done'}
            </Text>
          </View>
        </GlassSurface>
        <GlassSurface radius={24} strong style={styles.tile}>
          <View style={styles.tileInner}>
            <Text style={[typography.bigNumber, { color: colors.text }]}>{stats.perLabelCounts.Development}</Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>Development Task</Text>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 8 }]}>
              Status : {devOpen > 0 ? 'Working' : 'Done'}
            </Text>
          </View>
        </GlassSurface>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  calendarWrap: {
    marginTop: 16,
  },
  greeting: {
    marginLeft: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  statusCard: {
    marginTop: 16,
  },
  tile: {
    flex: 1,
  },
  tileInner: {
    padding: 16,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
