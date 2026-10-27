import type { Task, TaskLabel, TaskPriority } from '../types';

function isoDay(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function mondayOffset(): number {
  const today = new Date();
  const day = today.getDay();
  return day === 0 ? -6 : 1 - day;
}

interface SeedSpec {
  title: string;
  description: string;
  label: TaskLabel;
  priority: TaskPriority;
  dayOffset: number;
  startTime: string;
  endTime: string;
  status: 'open' | 'done';
  repo?: string;
}

const SPECS: SeedSpec[] = [
  { dayOffset: -2, description: 'Finalize the onboarding flow screens and empty states.', endTime: '11:30', label: 'Design', priority: 'high', startTime: '09:00', status: 'done', title: 'Design onboarding screens' },
  { dayOffset: -1, description: 'Review the pull request for the new calendar grid.', endTime: '12:00', label: 'Review', priority: 'medium', startTime: '10:00', status: 'done', title: 'Review calendar pull request' },
  { dayOffset: 0, description: 'Build the floating pill tab bar with haptic feedback.', endTime: '12:30', label: 'Development', priority: 'high', startTime: '10:00', status: 'open', title: 'Build floating tab bar' },
  { dayOffset: 0, description: 'Fix the month grid highlight on the selected range.', endTime: '15:00', label: 'Bug', priority: 'high', startTime: '13:30', status: 'open', title: 'Fix calendar range highlight' },
  { dayOffset: 0, description: 'Prepare the weekly status update for the team.', endTime: '17:00', label: 'Review', priority: 'low', startTime: '16:00', status: 'open', title: 'Write weekly status update' },
  { dayOffset: 1, description: 'Create the dark mode tokens for cards and charts.', endTime: '11:00', label: 'Design', priority: 'medium', startTime: '09:30', status: 'open', title: 'Design dark mode tokens' },
  { dayOffset: 1, description: 'Wire the task list to the GitHub issues cache.', endTime: '14:00', label: 'Development', priority: 'high', startTime: '12:00', status: 'open', title: 'Sync tasks with GitHub issues' },
  { dayOffset: 2, description: 'Test the app on iPad landscape and split view.', endTime: '13:00', label: 'Review', priority: 'medium', startTime: '11:00', status: 'open', title: 'Test iPad landscape layout' },
  { dayOffset: 2, description: 'Fix the time input validation on the new task form.', endTime: '16:00', label: 'Bug', priority: 'medium', startTime: '15:00', status: 'open', title: 'Fix time input validation' },
  { dayOffset: 3, description: 'Polish the hero progress card animation.', endTime: '12:00', label: 'Design', priority: 'low', startTime: '10:30', status: 'open', title: 'Polish hero card animation' },
  { dayOffset: 3, description: 'Implement pull to refresh on the tasks screen.', endTime: '15:30', label: 'Development', priority: 'medium', startTime: '14:00', status: 'open', title: 'Add pull to refresh' },
  { dayOffset: 4, description: 'Review milestone dates for the current sprint.', endTime: '11:30', label: 'Review', priority: 'low', startTime: '10:00', status: 'open', title: 'Review sprint milestones' },
  { dayOffset: -3, description: 'Ship the first beta build to TestFlight.', endTime: '18:00', label: 'Development', priority: 'high', startTime: '15:00', status: 'done', title: 'Ship beta build' },
  { dayOffset: -4, description: 'Fix the crash on empty task search results.', endTime: '12:30', label: 'Bug', priority: 'high', startTime: '11:00', status: 'done', title: 'Fix empty search crash' },
  { dayOffset: 5, description: 'Design the profile settings screen.', endTime: '13:30', label: 'Design', priority: 'medium', startTime: '12:00', status: 'open', title: 'Design profile settings' },
  { dayOffset: 6, description: 'Add offline caching for repos and issues.', endTime: '16:00', label: 'Development', priority: 'high', startTime: '13:00', status: 'open', title: 'Add offline caching' },
  { dayOffset: 7, description: 'Write release notes for version 1.0.', endTime: '12:00', label: 'Review', priority: 'low', startTime: '11:00', status: 'open', title: 'Write release notes' },
  { dayOffset: mondayOffset(), description: 'Plan the week and assign the new tasks.', endTime: '10:30', label: 'Review', priority: 'medium', startTime: '09:00', status: 'open', title: 'Plan the week' },
];

export function seedTasks(): Task[] {
  return SPECS.map((spec, index) => ({
    date: isoDay(spec.dayOffset),
    description: spec.description,
    endTime: spec.endTime,
    id: `seed-${index + 1}`,
    label: spec.label,
    priority: spec.priority,
    repo: spec.repo,
    startTime: spec.startTime,
    status: spec.status,
    title: spec.title,
  }));
}

export const demoUser = {
  avatarUrl: '',
  htmlUrl: 'https://github.com',
  login: 'demo',
  name: 'Demo User',
};
