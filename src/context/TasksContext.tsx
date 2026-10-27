import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seedTasks } from '../data/seed';
import { closeGitHubIssue } from '../services/github';
import { getStoredJson, setStoredJson, TASKS_KEY } from '../services/storage';
import type { Task, TasksStats, TaskLabel } from '../types';
import { useAuth } from './AuthContext';

interface TasksContextValue {
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  isLoaded: boolean;
  isOffline: boolean;
  refreshFromGitHub: () => Promise<string>;
  setOffline: (value: boolean) => void;
  stats: TasksStats;
  tasks: Task[];
  toggleComplete: (id: string) => Promise<void>;
  updateTask: (task: Task) => void;
}

const TasksContext = createContext<TasksContextValue>({
  addTask: () => undefined,
  deleteTask: () => undefined,
  isLoaded: false,
  isOffline: false,
  refreshFromGitHub: async () => '',
  setOffline: () => undefined,
  stats: {
    assigned: 0,
    completed: 0,
    completedRatio: 0,
    hoursPerWeekday: [0, 0, 0, 0, 0],
    newThisWeek: 0,
    pending: 0,
    perLabelCounts: { Bug: 0, Design: 0, Development: 0, Review: 0 },
    tasksPerDate: {},
    total: 0,
    totalHoursThisMonth: 0,
    upcomingCount: 0,
    weeklyCompletedRatio: 0,
  },
  tasks: [],
  toggleComplete: async () => undefined,
  updateTask: () => undefined,
});

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }
  return hours * 60 + minutes;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - (day === 0 ? 6 : day - 1));
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function computeStats(tasks: Task[], now: Date): TasksStats {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'done').length;
  const pending = total - completed;
  const assigned = tasks.filter((task) => task.status === 'open').length;
  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekTasks = tasks.filter((task) => {
    const date = new Date(`${task.date}T00:00:00`);
    return date >= weekStart && date < weekEnd;
  });
  const weekDone = weekTasks.filter((task) => task.status === 'done').length;
  const newThisWeek = tasks.filter((task) => {
    const date = new Date(`${task.date}T00:00:00`);
    return date >= weekStart && date < weekEnd && task.status === 'open';
  }).length;
  const upcomingCount = tasks.filter((task) => {
    const date = new Date(`${task.date}T00:00:00`);
    return task.status === 'open' && date >= new Date(now.toISOString().slice(0, 10) + 'T00:00:00');
  }).length;
  const hoursPerWeekday = [0, 0, 0, 0, 0];
  let totalHoursThisMonth = 0;
  tasks.forEach((task) => {
    const date = new Date(`${task.date}T00:00:00`);
    const duration = Math.max(0, (toMinutes(task.endTime) - toMinutes(task.startTime)) / 60);
    if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
      totalHoursThisMonth += duration;
    }
    if (date >= weekStart && date < weekEnd) {
      const weekday = date.getDay();
      if (weekday >= 1 && weekday <= 5) {
        hoursPerWeekday[weekday - 1] += duration;
      }
    }
  });
  const tasksPerDate: Record<string, number> = {};
  tasks.forEach((task) => {
    tasksPerDate[task.date] = (tasksPerDate[task.date] ?? 0) + 1;
  });
  const perLabelCounts: Record<TaskLabel, number> = { Bug: 0, Design: 0, Development: 0, Review: 0 };
  tasks.forEach((task) => {
    perLabelCounts[task.label] += 1;
  });
  return {
    assigned,
    completed,
    completedRatio: total === 0 ? 0 : completed / total,
    hoursPerWeekday,
    newThisWeek,
    pending,
    perLabelCounts,
    tasksPerDate,
    total,
    totalHoursThisMonth,
    upcomingCount,
    weeklyCompletedRatio: weekTasks.length === 0 ? 0 : weekDone / weekTasks.length,
  };
}

export function tasksForDate(tasks: Task[], date: string): Task[] {
  return tasks.filter((task) => task.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function tasksForToday(tasks: Task[]): Task[] {
  return tasksForDate(tasks, new Date().toISOString().slice(0, 10));
}

export function isToday(date: string): boolean {
  return sameDay(new Date(`${date}T00:00:00`), new Date());
}

export function TasksProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { demoMode, syncGitHub, token } = useAuth();
  const tasksRef = useRef<Task[]>([]);
  tasksRef.current = tasks;

  useEffect(() => {
    let cancelled = false;
    getStoredJson<Task[]>(TASKS_KEY).then((stored) => {
      if (cancelled) {
        return;
      }
      if (stored && stored.length > 0) {
        setTasks(stored);
      } else {
        setTasks(seedTasks());
      }
      setIsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      void setStoredJson(TASKS_KEY, tasks);
    }
  }, [isLoaded, tasks]);

  const addTask = useCallback((task: Task): void => {
    setTasks((current) => [task, ...current]);
  }, []);

  const updateTask = useCallback((task: Task): void => {
    setTasks((current) => current.map((item) => (item.id === task.id ? task : item)));
  }, []);

  const deleteTask = useCallback((id: string): void => {
    setTasks((current) => current.filter((item) => item.id !== id));
  }, []);

  const toggleComplete = useCallback(
    async (id: string): Promise<void> => {
      const task = tasksRef.current.find((item) => item.id === id);
      if (!task) {
        return;
      }
      const next: Task = { ...task, status: task.status === 'done' ? 'open' : 'done' };
      setTasks((current) => current.map((item) => (item.id === id ? next : item)));
      if (next.status === 'done' && task.repo && task.issueNumber && token && !demoMode) {
        try {
          await closeGitHubIssue(token, task.repo, task.issueNumber);
        } catch {
          return;
        }
      }
    },
    [demoMode, token],
  );

  const refreshFromGitHub = useCallback(async (): Promise<string> => {
    const result = await syncGitHub();
    if (result.tasks.length > 0) {
      const localOnly = tasksRef.current.filter((task) => !task.id.startsWith('gh-'));
      const merged = [...result.tasks, ...localOnly];
      setTasks(merged);
      setIsOffline(false);
    } else if (result.message.toLowerCase().includes('offline')) {
      setIsOffline(true);
    }
    return result.message;
  }, [syncGitHub]);

  const stats = useMemo(() => computeStats(tasks, new Date()), [tasks]);

  const value = useMemo<TasksContextValue>(
    () => ({
      addTask,
      deleteTask,
      isLoaded,
      isOffline,
      refreshFromGitHub,
      setOffline: setIsOffline,
      stats,
      tasks,
      toggleComplete,
      updateTask,
    }),
    [addTask, deleteTask, isLoaded, isOffline, refreshFromGitHub, stats, tasks, toggleComplete, updateTask],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  return useContext(TasksContext);
}
