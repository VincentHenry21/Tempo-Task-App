export type TaskLabel = 'Design' | 'Development' | 'Bug' | 'Review';
export type TaskStatus = 'open' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  label: TaskLabel;
  status: TaskStatus;
  priority: TaskPriority;
  date: string;
  startTime: string;
  endTime: string;
  repo?: string;
  issueNumber?: number;
  githubUrl?: string;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface TasksStats {
  total: number;
  pending: number;
  assigned: number;
  completed: number;
  completedRatio: number;
  newThisWeek: number;
  upcomingCount: number;
  totalHoursThisMonth: number;
  hoursPerWeekday: number[];
  tasksPerDate: Record<string, number>;
  perLabelCounts: Record<TaskLabel, number>;
  weeklyCompletedRatio: number;
}
