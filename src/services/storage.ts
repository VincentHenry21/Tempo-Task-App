import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const TOKEN_KEY = 'tempo-github-token';
export const USER_KEY = 'tempo-github-user';
export const TASKS_KEY = 'tempo-tasks';
export const REPOS_KEY = 'tempo-repos';
export const THEME_KEY = 'tempo-theme-mode';
export const LAST_SYNC_KEY = 'tempo-last-sync';
export const DEMO_KEY = 'tempo-demo-mode';

export async function getSecureToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setSecureToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearSecureToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    return;
  }
}

export async function getStoredValue(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setStoredValue(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    return;
  }
}

export async function removeStoredValue(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    return;
  }
}

export async function getStoredJson<T>(key: string): Promise<T | null> {
  const raw = await getStoredValue(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setStoredJson(key: string, value: unknown): Promise<void> {
  await setStoredValue(key, JSON.stringify(value));
}
