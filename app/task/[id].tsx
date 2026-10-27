import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GlassSurface } from '../../src/components/GlassSurface';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';
import type { TaskLabel, TaskPriority } from '../../src/types';

const LABELS: TaskLabel[] = ['Design', 'Development', 'Bug', 'Review'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export default function TaskDetail(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deleteTask, tasks, toggleComplete, updateTask } = useTasks();
  const task = tasks.find((item) => item.id === id);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [date, setDate] = useState(task?.date ?? '');
  const [startTime, setStartTime] = useState(task?.startTime ?? '10:00');
  const [endTime, setEndTime] = useState(task?.endTime ?? '11:00');
  const [label, setLabel] = useState<TaskLabel>(task?.label ?? 'Development');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [message, setMessage] = useState<string | null>(null);

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>That task could not be found.</Text>
        <PrimaryButton accessibilityLabel="Go back" onPress={() => router.back()} title="Go back" />
      </View>
    );
  }

  const validTime = (value: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(`${date}T00:00:00`).getTime());

  const handleSave = (): void => {
    if (!title.trim()) {
      setMessage('Give the task a title first.');
      return;
    }
    if (!validDate) {
      setMessage('Use a date in YYYY-MM-DD format.');
      return;
    }
    if (!validTime(startTime) || !validTime(endTime) || startTime >= endTime) {
      setMessage('Use valid start and end times, with start before end.');
      return;
    }
    updateTask({ ...task, date, description, endTime, label, priority, startTime, title: title.trim() });
    setMessage('Saved.');
    router.back();
  };

  const inputStyle = { borderColor: colors.divider, color: colors.text };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <GlassSurface radius={24} strong>
          <View style={styles.formInner}>
        <Text style={[typography.sectionTitle, { color: colors.text }]}>Task detail</Text>
        {task.githubUrl ? (
          <Text style={[typography.body, { color: colors.primary, marginTop: 8 }]}>
            Linked issue #{task.issueNumber} in {task.repo}
          </Text>
        ) : null}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Title</Text>
        <TextInput
          accessibilityLabel="Task title"
          onChangeText={setTitle}
          style={[styles.input, inputStyle]}
          value={title}
        />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
        <TextInput
          accessibilityLabel="Task description"
          multiline
          onChangeText={setDescription}
          style={[styles.input, styles.multiline, inputStyle]}
          value={description}
        />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Label</Text>
        <View style={styles.chipRow}>
          {LABELS.map((item) => (
            <Pressable
              key={item}
              accessibilityLabel={`Label ${item}`}
              accessibilityRole="button"
              onPress={() => setLabel(item)}
              style={[styles.chip, { backgroundColor: label === item ? colors.primary : colors.surface, borderColor: colors.divider }]}
            >
              <Text style={[typography.body, { color: label === item ? '#FFFFFF' : colors.text }]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Priority</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((item) => (
            <Pressable
              key={item}
              accessibilityLabel={`Priority ${item}`}
              accessibilityRole="button"
              onPress={() => setPriority(item)}
              style={[styles.chip, { backgroundColor: priority === item ? colors.primary : colors.surface, borderColor: colors.divider }]}
            >
              <Text style={[typography.body, { color: priority === item ? '#FFFFFF' : colors.text }]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Due date (YYYY-MM-DD)</Text>
        <TextInput
          accessibilityLabel="Due date"
          autoCapitalize="none"
          onChangeText={setDate}
          style={[styles.input, inputStyle]}
          value={date}
        />
        <View style={styles.timeRow}>
          <View style={styles.timeField}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Start time</Text>
            <TextInput
              accessibilityLabel="Start time"
              onChangeText={setStartTime}
              placeholder="10:00"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, inputStyle]}
              value={startTime}
            />
          </View>
          <View style={styles.timeField}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>End time</Text>
            <TextInput
              accessibilityLabel="End time"
              onChangeText={setEndTime}
              placeholder="11:00"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, inputStyle]}
              value={endTime}
            />
          </View>
        </View>
        {message ? <Text style={[typography.body, { color: colors.danger, marginTop: 12 }]}>{message}</Text> : null}
        <PrimaryButton accessibilityLabel="Save task" onPress={handleSave} style={styles.saveButton} title="Save changes" />
        <PrimaryButton
          accessibilityLabel={task.status === 'done' ? 'Reopen task' : 'Complete task'}
          onPress={() => {
            void toggleComplete(task.id).then(() => router.back());
          }}
          title={task.status === 'done' ? 'Reopen task' : 'Mark complete'}
          variant="outline"
        />
        <Pressable
          accessibilityLabel="Delete task"
          accessibilityRole="button"
          onPress={() => {
            deleteTask(task.id);
            router.back();
          }}
          style={styles.deleteButton}
        >
          <Text style={[typography.body, { color: colors.danger, fontWeight: '600' }]}>Delete task</Text>
        </Pressable>
          </View>
        </GlassSurface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  deleteButton: {
    alignItems: 'center',
    marginTop: 20,
    minHeight: 44,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  formInner: {
    padding: 16,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  multiline: {
    minHeight: 96,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  root: {
    flex: 1,
  },
  saveButton: {
    marginTop: 24,
  },
  timeField: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
