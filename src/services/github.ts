import type { GitHubRepo, GitHubUser, Task, TaskLabel } from '../types';

const API_BASE = 'https://api.github.com';

export class GitHubApiError extends Error {
  status: number;
  resetAt: string | null;

  constructor(status: number, message: string, resetAt: string | null) {
    super(message);
    this.status = status;
    this.resetAt = resetAt;
  }
}

async function request<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new Error('You appear to be offline. Check your connection and try again.');
  }
  if (response.status === 401) {
    throw new GitHubApiError(401, 'Your GitHub session has expired. Please sign in again.', null);
  }
  if (response.status === 403) {
    const reset = response.headers.get('x-ratelimit-reset');
    const resetAt = reset ? new Date(Number(reset) * 1000).toLocaleTimeString() : null;
    throw new GitHubApiError(
      403,
      resetAt
        ? `GitHub rate limit reached. It resets at ${resetAt}.`
        : 'GitHub refused this request. Please try again later.',
      resetAt,
    );
  }
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}). Please try again.`);
  }
  return (await response.json()) as T;
}

interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
}

interface RawIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  labels: Array<{ name: string } | string>;
  milestone: { due_on: string | null } | null;
  repository_url: string;
}

function labelName(label: { name: string } | string): string {
  return typeof label === 'string' ? label : label.name;
}

function mapLabel(raw: string | undefined): TaskLabel {
  const lower = (raw ?? '').toLowerCase();
  if (lower.includes('bug')) {
    return 'Bug';
  }
  if (lower.includes('review')) {
    return 'Review';
  }
  if (lower.includes('design')) {
    return 'Design';
  }
  return 'Development';
}

function repoNameFromUrl(url: string): string {
  const parts = url.split('/repos/');
  return parts.length > 1 ? parts[1] : '';
}

export function mapIssueToTask(issue: RawIssue): Task {
  const due = issue.milestone?.due_on ? issue.milestone.due_on.slice(0, 10) : new Date().toISOString().slice(0, 10);
  const firstLabel = issue.labels.length > 0 ? labelName(issue.labels[0]) : undefined;
  return {
    date: due,
    description: issue.body ?? '',
    endTime: '12:00',
    githubUrl: issue.html_url,
    id: `gh-${issue.id}`,
    issueNumber: issue.number,
    label: mapLabel(firstLabel),
    priority: 'medium',
    repo: repoNameFromUrl(issue.repository_url),
    startTime: '10:00',
    status: issue.state === 'closed' ? 'done' : 'open',
    title: issue.title,
  };
}

export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const raw = await request<RawUser>(token, '/user');
  return {
    avatarUrl: raw.avatar_url,
    htmlUrl: raw.html_url,
    login: raw.login,
    name: raw.name,
  };
}

export async function fetchGitHubRepos(token: string): Promise<GitHubRepo[]> {
  const raw = await request<RawRepo[]>(token, '/user/repos?per_page=30&sort=updated');
  return raw.map((repo) => ({
    fullName: repo.full_name,
    htmlUrl: repo.html_url,
    id: repo.id,
    name: repo.name,
  }));
}

export async function fetchAssignedIssues(token: string): Promise<Task[]> {
  const raw = await request<RawIssue[]>(token, '/issues?filter=assigned&state=all&per_page=30');
  return raw.map(mapIssueToTask);
}

export async function createGitHubIssue(
  token: string,
  repoFullName: string,
  title: string,
  body: string,
): Promise<{ number: number; htmlUrl: string }> {
  const raw = await request<{ html_url: string; number: number }>(token, `/repos/${repoFullName}/issues`, {
    body: JSON.stringify({ body, title }),
    method: 'POST',
  });
  return { htmlUrl: raw.html_url, number: raw.number };
}

export async function closeGitHubIssue(token: string, repoFullName: string, issueNumber: number): Promise<void> {
  await request(token, `/repos/${repoFullName}/issues/${issueNumber}`, {
    body: JSON.stringify({ state: 'closed' }),
    method: 'PATCH',
  });
}
