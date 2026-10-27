import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { demoUser } from '../data/seed';
import { closeGitHubIssue, createGitHubIssue, fetchAssignedIssues, fetchGitHubRepos, fetchGitHubUser, GitHubApiError } from '../services/github';
import {
  clearSecureToken,
  DEMO_KEY,
  getSecureToken,
  getStoredJson,
  getStoredValue,
  LAST_SYNC_KEY,
  REPOS_KEY,
  removeStoredValue,
  setSecureToken,
  setStoredJson,
  setStoredValue,
  USER_KEY,
} from '../services/storage';
import type { GitHubRepo, GitHubUser, Task } from '../types';

interface AuthContextValue {
  demoMode: boolean;
  error: string | null;
  isReady: boolean;
  isSignedIn: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  logout: () => Promise<void>;
  repos: GitHubRepo[];
  signInDemo: () => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
  syncGitHub: () => Promise<{ tasks: Task[]; message: string }>;
  token: string | null;
  user: GitHubUser | null;
}

const AuthContext = createContext<AuthContextValue>({
  demoMode: false,
  error: null,
  isReady: false,
  isSignedIn: false,
  isSyncing: false,
  lastSyncAt: null,
  logout: async () => undefined,
  repos: [],
  signInDemo: async () => undefined,
  signInWithToken: async () => undefined,
  syncGitHub: async () => ({ message: '', tasks: [] }),
  token: null,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    (async () => {
      const [storedToken, storedUser, storedRepos, storedSync, storedDemo] = await Promise.all([
        getSecureToken(),
        getStoredJson<GitHubUser>(USER_KEY),
        getStoredJson<GitHubRepo[]>(REPOS_KEY),
        getStoredValue(LAST_SYNC_KEY),
        getStoredValue(DEMO_KEY),
      ]);
      if (cancelled) {
        return;
      }
      if (storedDemo === '1') {
        setDemoMode(true);
        setUser(demoUser);
        setIsReady(true);
        return;
      }
      if (storedRepos) {
        setRepos(storedRepos);
      }
      if (storedSync) {
        setLastSyncAt(storedSync);
      }
      if (storedToken) {
        try {
          const freshUser = await fetchGitHubUser(storedToken);
          if (cancelled) {
            return;
          }
          setToken(storedToken);
          setUser(freshUser);
          await setStoredJson(USER_KEY, freshUser);
        } catch {
          if (storedUser) {
            setToken(storedToken);
            setUser(storedUser);
            setError('Your GitHub session could not be verified. Showing cached data.');
          } else {
            await clearSecureToken();
            setError('Your GitHub session has expired. Please sign in again.');
          }
        }
      }
      if (!cancelled) {
        setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
      mounted.current = false;
    };
  }, []);

  const signInWithToken = useCallback(async (nextToken: string): Promise<void> => {
    setError(null);
    const freshUser = await fetchGitHubUser(nextToken);
    const freshRepos = await fetchGitHubRepos(nextToken).catch(() => [] as GitHubRepo[]);
    await setSecureToken(nextToken);
    await setStoredJson(USER_KEY, freshUser);
    await setStoredJson(REPOS_KEY, freshRepos);
    await removeStoredValue(DEMO_KEY);
    setToken(nextToken);
    setUser(freshUser);
    setRepos(freshRepos);
    setDemoMode(false);
  }, []);

  const signInDemo = useCallback(async (): Promise<void> => {
    await setStoredValue(DEMO_KEY, '1');
    setDemoMode(true);
    setUser(demoUser);
    setToken(null);
    setError(null);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await clearSecureToken();
    await removeStoredValue(USER_KEY);
    await removeStoredValue(REPOS_KEY);
    await removeStoredValue(DEMO_KEY);
    setToken(null);
    setUser(null);
    setRepos([]);
    setDemoMode(false);
    setError(null);
  }, []);

  const syncGitHub = useCallback(async (): Promise<{ tasks: Task[]; message: string }> => {
    if (demoMode) {
      return { message: 'Demo mode is using local data.', tasks: [] };
    }
    if (!token) {
      return { message: 'Sign in with GitHub to sync.', tasks: [] };
    }
    setIsSyncing(true);
    try {
      const [freshUser, freshRepos, issues] = await Promise.all([
        fetchGitHubUser(token),
        fetchGitHubRepos(token).catch(() => [] as GitHubRepo[]),
        fetchAssignedIssues(token),
      ]);
      await setStoredJson(USER_KEY, freshUser);
      await setStoredJson(REPOS_KEY, freshRepos);
      const now = new Date().toISOString();
      await setStoredValue(LAST_SYNC_KEY, now);
      if (mounted.current) {
        setUser(freshUser);
        setRepos(freshRepos);
        setLastSyncAt(now);
        setError(null);
      }
      return { message: `Synced ${issues.length} assigned issues.`, tasks: issues };
    } catch (caught) {
      const message = caught instanceof GitHubApiError && caught.status === 401
        ? 'Your GitHub session has expired. Please sign in again.'
        : caught instanceof Error
          ? caught.message
          : 'Sync failed. Showing cached data.';
      if (mounted.current) {
        setError(message);
      }
      if (caught instanceof GitHubApiError && caught.status === 401) {
        await logout();
      }
      return { message, tasks: [] };
    } finally {
      if (mounted.current) {
        setIsSyncing(false);
      }
    }
  }, [demoMode, logout, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      demoMode,
      error,
      isReady,
      isSignedIn: user !== null,
      isSyncing,
      lastSyncAt,
      logout,
      repos,
      signInDemo,
      signInWithToken,
      syncGitHub,
      token,
      user,
    }),
    [demoMode, error, isReady, isSyncing, lastSyncAt, logout, repos, signInDemo, signInWithToken, syncGitHub, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export async function createLinkedIssue(
  token: string,
  repoFullName: string,
  title: string,
  body: string,
): Promise<{ number: number; htmlUrl: string }> {
  return createGitHubIssue(token, repoFullName, title, body);
}

export async function closeLinkedIssue(token: string, repoFullName: string, issueNumber: number): Promise<void> {
  await closeGitHubIssue(token, repoFullName, issueNumber);
}
