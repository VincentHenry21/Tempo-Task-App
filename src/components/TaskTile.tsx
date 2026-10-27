import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radii } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';
import type { Task } from '../types';
import { Icon } from './Icon';

interface TaskTileProps {
  onPress: () => void;
  task: Task;
}

export function TaskTile({ onPress, task }: TaskTileProps): React.JSX.Element {
  const { colors } = useTheme();
  const done = task.status === 'done';
  const handlePress = (): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <Pressable
      accessibilityLabel={`${task.title}, ${task.label}, ${done ? 'completed' : 'open'}`}
      accessibilityRole="button"
      onPress={handlePress}
      style={styles.tile}
    >
      <View style={[styles.iconBox, { backgroundColor: task.label === 'Design' ? colors.primary : colors.limeStrong }]}>
        <Icon
          color={task.label === 'Design' ? '#FFFFFF' : colors.text}
          name={task.label === 'Design' ? 'color-palette-outline' : 'code-slash-outline'}
          size={20}
        />
      </View>
      <View style={styles.textBox}>
        <Text numberOfLines={1} style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
          {task.title}
        </Text>
        <Text style={[typography.small, { color: colors.textSecondary }]}>
          {task.startTime} - {task.endTime} · {task.label}
        </Text>
      </View>
      <Icon color={done ? colors.success : colors.textSecondary} name={done ? 'checkmark-circle' : 'ellipse-outline'} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  textBox: {
    flex: 1,
    marginLeft: 12,
  },
  tile: {
    alignItems: 'center',
    borderRadius: radii.tile,
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 64,
    padding: 12,
  },
});
