import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppMark } from '../../src/components/AppMark';
import { Avatar } from '../../src/components/Avatar';
import { GlassSurface } from '../../src/components/GlassSurface';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useAuth } from '../../src/context/AuthContext';
import { useTasks } from '../../src/context/TasksContext';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typography } from '../../src/theme/typography';
import type { ThemeMode } from '../../src/types';

const MODES: Array<{ label: string; value: ThemeMode }> = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function Profile(): React.JSX.Element {
  const { colors, glass, mode, setMode } = useTheme();
  const { demoMode, isSyncing, lastSyncAt, logout, user } = useAuth();
  const { refreshFromGitHub } = useTasks();
  const router = useRouter();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = async (): Promise<void> => {
    const message = await refreshFromGitHub();
    setSyncMessage(message);
  };

  const handleLogout = (): void => {
    Alert.alert('Log out', 'This clears your saved GitHub token and cached user.', [
      { style: 'cancel', text: 'Cancel' },
      {
        onPress: () => {
          void logout().then(() => router.replace('/welcome'));
        },
        style: 'destructive',
        text: 'Log out',
      },
    ]);
  };

  return (
    <ScreenContainer>
      <View style={styles.profileHead}>
        <AppMark size={48} />
        <Avatar imageUrl={user?.avatarUrl || undefined} name={user?.name ?? user?.login ?? 'Tempo'} size={72} />
        <Text style={[typography.name, { color: colors.text, marginTop: 16 }]}>{user?.name ?? user?.login ?? 'Tempo user'}</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>@{user?.login ?? 'unknown'}</Text>
        {demoMode ? (
          <Text style={[typography.small, { color: colors.textSecondary, marginTop: 8 }]}>Demo mode · no GitHub connection</Text>
        ) : null}
      </View>
      <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 28 }]}>Appearance</Text>
      <View style={styles.modeRow}>
        {MODES.map((item) => (
          <GlassSurface
            key={item.value}
            accessibilityLabel={`Theme ${item.label}`}
            onPress={() => setMode(item.value)}
            radius={999}
            style={styles.modeButton}
            tint={mode === item.value ? glass.tintBlue : undefined}
          >
            <View style={styles.modeInner}>
              <Text style={[typography.body, { color: mode === item.value ? '#FFFFFF' : colors.text }]}>{item.label}</Text>
            </View>
          </GlassSurface>
        ))}
      </View>
      <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 28 }]}>GitHub sync</Text>
      <PrimaryButton
        accessibilityLabel="Sync with GitHub"
        disabled={isSyncing}
        onPress={() => void handleSync()}
        title={isSyncing ? 'Syncing...' : 'Sync with GitHub'}
      />
      {lastSyncAt ? (
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 12 }]}>
          Last sync: {new Date(lastSyncAt).toLocaleString()}
        </Text>
      ) : null}
      {syncMessage ? (
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>{syncMessage}</Text>
      ) : null}
      <View style={styles.logoutWrap}>
        <PrimaryButton accessibilityLabel="Log out" onPress={handleLogout} title="Log out" variant="outline" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoutWrap: {
    marginTop: 32,
  },
  modeButton: {
    flex: 1,
  },
  modeInner: {
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  profileHead: {
    alignItems: 'center',
  },
});
