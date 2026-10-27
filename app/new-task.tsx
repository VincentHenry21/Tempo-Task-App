import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GlassSurface } from '../src/components/GlassSurface';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { useTasks } from '../src/context/TasksContext';
import { createGitHubIssue } from '../src/services/github';
import { useTheme } from '../src/theme/ThemeProvider';
import { typography } from '../src/theme/typography';
import type { TaskLabel, TaskPriority } from '../src/types';

const LABELS: TaskLabel[] = ['Design', 'Development', 'Bug', 'Review'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowKey(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function NewTask(): React.JSX.Element {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; startTime?: string }>();
  const { addTask } = useTasks();
  const { demoMode, repos, token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(typeof params.date === 'string' ? params.date : todayKey());
  const [startTime, setStartTime] = useState(typeof params.startTime === 'string' ? params.startTime : '10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [label, setLabel] = useState<TaskLabel>('Development');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [repo, setRepo] = useState<string>('');
  const [linkIssue, setLinkIssue] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const validTime = (value: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(`${date}T00:00:00`).getTime());

  const handleCreate = async (): Promise<void> => {
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
    if (linkIssue && !repo) {
      setMessage('Pick a repo to link this task to a GitHub issue.');
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      let issueNumber: number | undefined;
      let githubUrl: string | undefined;
      if (linkIssue && repo && token && !demoMode) {
        const created = await createGitHubIssue(token, repo, title.trim(), description);
        issueNumber = created.number;
        githubUrl = created.htmlUrl;
      } else if (linkIssue && demoMode) {
        setMessage('Demo mode cannot create real issues. The task was saved locally instead.');
      }
      addTask({
        date,
        description,
        endTime,
        githubUrl,
        id: `local-${Date.now()}`,
        issueNumber,
        label,
        priority,
        repo: repo || undefined,
        startTime,
        status: 'open',
        title: title.trim(),
      });
      router.back();
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not create the task. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = { borderColor: colors.divider, color: colors.text };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <GlassSurface radius={24} strong>
          <View style={styles.formInner}>
        <Text style={[typography.sectionTitle, { color: colors.text }]}>New task</Text>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Title</Text>
        <TextInput
          accessibilityLabel="Task title"
          onChangeText={setTitle}
          placeholder="What needs doing?"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, inputStyle]}
          value={title}
        />
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
        <TextInput
          accessibilityLabel="Task description"
          multiline
          onChangeText={setDescription}
          placeholder="Add some detail"
          placeholderTextColor={colors.textSecondary}
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
        <View style={styles.quickRow}>
          <Pressable accessibilityLabel="Due today" accessibilityRole="button" onPress={() => setDate(todayKey())} style={styles.quickButton}>
            <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>Today</Text>
          </Pressable>
          <Pressable accessibilityLabel="Due tomorrow" accessibilityRole="button" onPress={() => setDate(tomorrowKey())} style={styles.quickButton}>
            <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>Tomorrow</Text>
          </Pressable>
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
              style={[styles.input, inputStyle]}
              value={startTime}
            />
          </View>
          <View style={styles.timeField}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>End time</Text>
            <TextInput
              accessibilityLabel="End time"
              onChangeText={setEndTime}
              style={[styles.input, inputStyle]}
              value={endTime}
            />
          </View>
        </View>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Repo (optional)</Text>
        <View style={styles.chipRow}>
          <Pressable
            accessibilityLabel="No repo"
            accessibilityRole="button"
            onPress={() => setRepo('')}
            style={[styles.chip, { backgroundColor: repo === '' ? colors.primary : colors.surface, borderColor: colors.divider }]}
          >
            <Text style={[typography.body, { color: repo === '' ? '#FFFFFF' : colors.text }]}>Local only</Text>
          </Pressable>
          {repos.map((item) => (
            <Pressable
              key={item.id}
              accessibilityLabel={`Repo ${item.fullName}`}
              accessibilityRole="button"
              onPress={() => setRepo(item.fullName)}
              style={[styles.chip, { backgroundColor: repo === item.fullName ? colors.primary : colors.surface, borderColor: colors.divider }]}
            >
              <Text style={[typography.body, { color: repo === item.fullName ? '#FFFFFF' : colors.text }]}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.toggleRow}>
          <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>Link to GitHub issue</Text>
          <Switch accessibilityLabel="Link to GitHub issue" onValueChange={setLinkIssue} value={linkIssue} />
        </View>
        {linkIssue && demoMode ? (
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Demo mode saves tasks locally. Sign in with GitHub to create real issues.
          </Text>
        ) : null}
        {message ? <Text style={[typography.body, { color: colors.danger, marginTop: 12 }]}>{message}</Text> : null}
        <PrimaryButton
          accessibilityLabel="Create task"
          disabled={busy}
          onPress={() => void handleCreate()}
          style={styles.createButton}
          title={busy ? 'Creating...' : 'Create task'}
        />
          </View>
        </GlassSurface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  createButton: {
    marginTop: 24,
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
  quickButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  root: {
    flex: 1,
  },
  timeField: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
