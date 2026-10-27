import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { GlassSurface } from '../../src/components/GlassSurface';
import { Icon } from '../../src/components/Icon';
import { TaskTile } from '../../src/components/TaskTile';
import { useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';
import type { Task } from '../../src/types';

type Filter = 'All' | 'Today' | 'Upcoming' | 'Done';

const FILTERS: Filter[] = ['All', 'Today', 'Upcoming', 'Done'];

export default function Tasks(): React.JSX.Element {
  const { colors, glass } = useTheme();
  const { isOffline, refreshFromGitHub, stats, tasks, toggleComplete } = useTasks();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const visible = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lowered = query.trim().toLowerCase();
    return tasks.filter((task) => {
      if (lowered && !`${task.title} ${task.description} ${task.label}`.toLowerCase().includes(lowered)) {
        return false;
      }
      if (filter === 'Today') {
        return task.date === today;
      }
      if (filter === 'Upcoming') {
        return task.status === 'open' && task.date >= today;
      }
      if (filter === 'Done') {
        return task.status === 'done';
      }
      return true;
    });
  }, [filter, query, tasks]);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    const result = await refreshFromGitHub();
    setMessage(result);
    setRefreshing(false);
  };

  const renderRightActions = (task: Task): React.JSX.Element => (
    <Pressable
      accessibilityLabel={task.status === 'done' ? 'Reopen task' : 'Complete task'}
      accessibilityRole="button"
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        void toggleComplete(task.id);
      }}
      style={[styles.swipeAction, { backgroundColor: colors.success }]}
    >
      <Text style={[typography.body, { color: '#FFFFFF', fontWeight: '600' }]}>
        {task.status === 'done' ? 'Reopen' : 'Complete'}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <Text style={[typography.sectionTitle, { color: colors.text }]}>Tasks</Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              {stats.total} tasks · {stats.completed} done
            </Text>
            {isOffline ? (
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 8 }]}>Offline · showing cached tasks</Text>
            ) : null}
            {message ? (
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 8 }]}>{message}</Text>
            ) : null}
            <GlassSurface radius={16} strong style={{ marginTop: 16 }}>
              <View style={styles.searchBox}>
                <Icon color={colors.textSecondary} name="search-outline" size={18} />
                <TextInput
                  accessibilityLabel="Search tasks"
                  onChangeText={setQuery}
                  placeholder="Search tasks"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.searchInput, { color: colors.text }]}
                  value={query}
                />
              </View>
            </GlassSurface>
            <View style={styles.filters}>
              {FILTERS.map((item) => (
                <GlassSurface
                  key={item}
                  accessibilityLabel={`Filter ${item}`}
                  onPress={() => setFilter(item)}
                  radius={999}
                  tint={filter === item ? glass.tintBlue : undefined}
                >
                  <View style={styles.filterButton}>
                    <Text style={[typography.body, { color: filter === item ? '#FFFFFF' : colors.text }]}>{item}</Text>
                  </View>
                </GlassSurface>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon color={colors.textSecondary} name="clipboard-outline" size={36} />
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 12, textAlign: 'center' }]}>
              No tasks match. Try another search or filter.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        data={visible}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl onRefresh={() => void handleRefresh()} refreshing={refreshing} />}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <TaskTile onPress={() => router.push(`/task/${item.id}` as never)} task={item} />
          </Swipeable>
        )}
      />
      <GlassSurface
        accessibilityLabel="Create task"
        onPress={() => router.push('/new-task')}
        radius={28}
        style={styles.fab}
        tint={glass.tintBlue}
      >
        <View style={styles.fabInner}>
          <Icon color="#FFFFFF" name="add-outline" size={28} />
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    padding: 32,
  },
  fab: {
    bottom: 110,
    position: 'absolute',
    right: 20,
  },
  fabInner: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  filterButton: {
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 190,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  root: {
    flex: 1,
  },
  searchBox: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  swipeAction: {
    alignItems: 'center',
    borderRadius: 22,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 8,
    paddingHorizontal: 20,
  },
});
