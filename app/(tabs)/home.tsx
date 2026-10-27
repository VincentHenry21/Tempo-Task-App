import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../src/components/Avatar';
import { CalendarGrid } from '../../src/components/CalendarGrid';
import { Card } from '../../src/components/Card';
import { CircleButton } from '../../src/components/CircleButton';
import { GlassSurface } from '../../src/components/GlassSurface';
import { HeroProgressCard } from '../../src/components/HeroProgressCard';
import { Icon } from '../../src/components/Icon';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { StatCard } from '../../src/components/StatCard';
import { TaskTile } from '../../src/components/TaskTile';
import { WeekBarChart } from '../../src/components/WeekBarChart';
import { useAuth } from '../../src/context/AuthContext';
import { tasksForToday, useTasks } from '../../src/context/TasksContext';
import { useResponsive } from '../../src/hooks/useResponsive';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';

function weekWindow(now: Date): { end: Date; start: Date } {
  const start = new Date(now);
  const day = start.getDay();
  start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { end, start };
}

export default function Home(): React.JSX.Element {
  const { colors } = useTheme();
  const { isOffline, stats, tasks } = useTasks();
  const { demoMode, error, user } = useAuth();
  const router = useRouter();
  const { isLandscape, isTablet } = useResponsive();
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const twoPane = isTablet && isLandscape;

  const firstName = (user?.name ?? user?.login ?? 'there').split(' ')[0];
  const weekStats = useMemo(() => {
    const now = new Date();
    const { end, start } = weekWindow(now);
    const weekTasks = tasks.filter((task) => {
      const date = new Date(`${task.date}T00:00:00`);
      return date >= start && date < end;
    });
    return {
      done: weekTasks.filter((task) => task.status === 'done').length,
      total: weekTasks.length,
    };
  }, [tasks]);
  const todayTasks = useMemo(() => tasksForToday(tasks), [tasks]);
  const dueSoon = useMemo(() => {
    const now = new Date();
    const limit = new Date(now);
    limit.setDate(limit.getDate() + 2);
    return tasks.filter((task) => {
      const date = new Date(`${task.date}T00:00:00`);
      return task.status === 'open' && date >= new Date(now.toISOString().slice(0, 10) + 'T00:00:00') && date <= limit;
    });
  }, [tasks]);

  const overview = (
    <View style={twoPane ? styles.paneLeft : undefined}>
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
          <CircleButton
            accessibilityLabel="Notifications"
            badge={dueSoon.length > 0}
            icon="notifications-outline"
            onPress={() => setNotificationsVisible(true)}
          />
        </View>
      </View>
      {isOffline ? (
        <GlassSurface radius={999} style={styles.chip}>
          <View style={styles.chipInner}>
            <Text style={[typography.small, { color: colors.textSecondary }]}>Offline · showing cached tasks</Text>
          </View>
        </GlassSurface>
      ) : null}
      {demoMode ? (
        <GlassSurface radius={999} style={styles.chip} tint={colors.limeStrong}>
          <View style={styles.chipInner}>
            <Text style={[typography.small, { color: colors.text }]}>Demo mode · seeded data</Text>
          </View>
        </GlassSurface>
      ) : null}
      {error ? (
        <Text style={[typography.body, { color: colors.danger, marginTop: 12 }]}>{error}</Text>
      ) : null}
      <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24 }]}>Task Overview</Text>
      <View style={styles.newRow}>
        <Icon color={colors.primary} name="clipboard-outline" size={20} />
        <Text style={[typography.body, { color: colors.text, flex: 1 }]}>
          You have {stats.newThisWeek} new {stats.newThisWeek === 1 ? 'task' : 'tasks'} for this week
        </Text>
        <Pressable accessibilityLabel="See all tasks" accessibilityRole="button" onPress={() => router.push('/(tabs)/tasks')}>
          <Text style={[typography.body, { color: colors.primary, textDecorationLine: 'underline' }]}>See all</Text>
        </Pressable>
      </View>
      <HeroProgressCard
        caption="Kindly assign all your new task asap."
        completed={weekStats.done}
        onPress={() => router.push('/(tabs)/tasks')}
        title="Manage your task"
        total={weekStats.total}
      />
      <View style={styles.statRow}>
        <StatCard
          accessibilityLabel={`Upcoming tasks: ${stats.upcomingCount}`}
          caption="Pending tasks ahead"
          count={stats.upcomingCount}
          onPress={() => router.push('/(tabs)/tasks')}
          tone="lime"
        />
        <StatCard
          accessibilityLabel={`Assigned tasks: ${stats.assigned}`}
          caption="Almost to be done"
          count={stats.assigned}
          onPress={() => router.push('/(tabs)/tasks')}
          tone="white"
        />
      </View>
      <Card style={styles.chartCard}>
        <WeekBarChart hours={stats.hoursPerWeekday} totalHours={stats.totalHoursThisMonth} />
      </Card>
      <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24 }]}>Today&apos;s tasks</Text>
      {todayTasks.length === 0 ? (
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
          Nothing scheduled for today. Enjoy the quiet.
        </Text>
      ) : (
        <GlassSurface radius={24} style={styles.listGlass}>
          <View style={styles.listInner}>
            {todayTasks.map((task) => (
              <TaskTile key={task.id} onPress={() => router.push(`/task/${task.id}` as never)} task={task} />
            ))}
          </View>
        </GlassSurface>
      )}
    </View>
  );

  return (
    <ScreenContainer>
      {twoPane ? (
        <View style={styles.twoPane}>
          {overview}
          <View style={styles.paneRight}>
            <Text style={[typography.sectionTitle, { color: colors.text }]}>Calendar</Text>
            <CalendarGrid tasksPerDate={stats.tasksPerDate} />
            <GlassSurface
              accessibilityLabel="Open schedule"
              onPress={() => router.push('/(tabs)/schedule')}
              radius={16}
              style={styles.scheduleLink}
            >
              <View style={styles.scheduleLinkInner}>
                <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>Open today&apos;s schedule</Text>
                <Icon color={colors.primary} name="arrow-forward-outline" size={18} />
              </View>
            </GlassSurface>
          </View>
        </View>
      ) : (
        overview
      )}
      <Modal animationType="slide" onRequestClose={() => setNotificationsVisible(false)} transparent visible={notificationsVisible}>
        <View style={styles.modalBackdrop}>
          <GlassSurface radius={32} strong style={styles.modalCard}>
            <View style={styles.sheetInner}>
            <View style={[styles.grabber, { backgroundColor: colors.textSecondary }]} />
            <Text style={[typography.sectionTitle, { color: colors.text }]}>Due soon</Text>
            {dueSoon.length === 0 ? (
              <Text style={[typography.body, { color: colors.textSecondary, marginTop: 12 }]}>
                Nothing due in the next two days.
              </Text>
            ) : (
              dueSoon.map((task) => (
                <Pressable
                  key={task.id}
                  accessibilityLabel={`Open ${task.title}`}
                  accessibilityRole="button"
                  onPress={() => {
                    setNotificationsVisible(false);
                    router.push(`/task/${task.id}` as never);
                  }}
                  style={[styles.dueRow, { borderColor: colors.divider }]}
                >
                  <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>{task.title}</Text>
                  <Text style={[typography.small, { color: colors.textSecondary }]}>{task.date}</Text>
                </Pressable>
              ))
            )}
            <Pressable
              accessibilityLabel="Close notifications"
              accessibilityRole="button"
              onPress={() => setNotificationsVisible(false)}
              style={styles.closeButton}
            >
              <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>Close</Text>
            </Pressable>
            </View>
          </GlassSurface>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    marginTop: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  chipInner: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeButton: {
    alignItems: 'center',
    marginTop: 16,
    minHeight: 44,
  },
  dueRow: {
    borderBottomWidth: 1,
    borderColor: '#E6E9EC',
    paddingVertical: 12,
  },
  grabber: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 5,
    marginBottom: 16,
    width: 48,
  },
  listGlass: {
    marginTop: 12,
  },
  listInner: {
    padding: 8,
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
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  sheetInner: {
    padding: 24,
  },
  newRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    marginTop: 12,
  },
  paneLeft: {
    flex: 0.4,
    paddingRight: 12,
  },
  paneRight: {
    flex: 0.6,
    paddingLeft: 12,
  },
  scheduleLink: {
    marginTop: 16,
  },
  scheduleLinkInner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  twoPane: {
    flexDirection: 'row',
  },
});
