import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppMark } from '../src/components/AppMark';
import { GlassSurface } from '../src/components/GlassSurface';
import { Icon } from '../src/components/Icon';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { GitHubApiError } from '../src/services/github';
import { useTheme } from '../src/theme/ThemeProvider';
import { typography } from '../src/theme/typography';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? '';
const REDIRECT_URI = AuthSession.makeRedirectUri({ path: 'auth', scheme: 'tempo' });
const DISCOVERY = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

export default function Login(): React.JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signInDemo, signInWithToken } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      scopes: ['repo', 'read:user'],
    },
    DISCOVERY,
  );

  const handleOAuth = async (): Promise<void> => {
    setError(null);
    if (!CLIENT_ID) {
      setError(
        'GitHub OAuth is not configured yet. Add EXPO_PUBLIC_GITHUB_CLIENT_ID to your environment, or sign in with a personal access token below.',
      );
      return;
    }
    if (!request) {
      setError('OAuth is still loading. Please try again in a moment.');
      return;
    }
    setBusy(true);
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        setError(
          'GitHub returned an authorization code, but exchanging it for a token requires a client secret on a backend. Use a personal access token or demo mode to continue.',
        );
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        setError('GitHub sign-in was cancelled.');
      } else {
        setError('GitHub sign-in did not complete. Please try again.');
      }
    } catch {
      setError('GitHub sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleToken = async (): Promise<void> => {
    const token = tokenInput.trim();
    if (!token) {
      setError('Enter a personal access token first.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithToken(token);
      router.replace('/(tabs)/home');
    } catch (caught) {
      if (caught instanceof GitHubApiError && caught.status === 401) {
        setError('That token is invalid. Check it and try again.');
      } else if (caught instanceof Error) {
        setError(caught.message);
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDemo = async (): Promise<void> => {
    setBusy(true);
    try {
      await signInDemo();
      router.replace('/(tabs)/home');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { paddingTop: insets.top + 16 }]}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.markRow}>
          <AppMark size={32} />
          <Text style={[styles.wordmark, { color: colors.text }]}>TEMPO</Text>
        </View>
        <Text style={[typography.name, { color: colors.text, marginTop: 32 }]}>Plan smarter.{'\n'}Ship faster.</Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 12 }]}>
          Connect GitHub to turn assigned issues into tasks, or try the demo with no setup.
        </Text>
        <PrimaryButton
          accessibilityLabel="Continue with GitHub"
          disabled={busy}
          onPress={() => void handleOAuth()}
          style={styles.githubButton}
          title="Continue with GitHub"
        />
        <Pressable
          accessibilityLabel="Use a personal access token"
          accessibilityRole="button"
          onPress={() => setShowToken((current) => !current)}
          style={styles.tokenToggle}
        >
          <Icon color={colors.primary} name="key-outline" size={18} />
          <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
            Use a personal access token
          </Text>
        </Pressable>
        {showToken ? (
          <View>
            <TextInput
              accessibilityLabel="Personal access token"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setTokenInput}
              placeholder="Paste your token here"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              style={[styles.input, { borderColor: colors.divider, color: colors.text }]}
              value={tokenInput}
            />
            <PrimaryButton
              accessibilityLabel="Sign in with token"
              disabled={busy}
              onPress={() => void handleToken()}
              title="Sign in with token"
              variant="outline"
            />
            <Pressable
              accessibilityLabel="How to create a token"
              accessibilityRole="button"
              onPress={() => setHelpVisible(true)}
              style={styles.helpLink}
            >
              <Text style={[typography.body, { color: colors.primary }]}>How to create a token</Text>
            </Pressable>
          </View>
        ) : null}
        {error ? (
          <GlassSurface radius={16} style={styles.errorBox} tint="rgba(255, 59, 48, 0.12)">
            <View style={styles.errorInner}>
              <Text style={[typography.body, { color: colors.danger }]}>{error}</Text>
            </View>
          </GlassSurface>
        ) : null}
        <Pressable
          accessibilityLabel="Try demo"
          accessibilityRole="button"
          disabled={busy}
          onPress={() => void handleDemo()}
          style={styles.demoLink}
        >
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            No GitHub account handy? <Text style={{ color: colors.primary, fontWeight: '600' }}>Try demo</Text>
          </Text>
        </Pressable>
      </ScrollView>
      <Modal animationType="slide" onRequestClose={() => setHelpVisible(false)} transparent visible={helpVisible}>
        <View style={styles.modalBackdrop}>
          <GlassSurface radius={32} strong style={styles.modalCard}>
            <View style={styles.modalInner}>
            <View style={[styles.grabber, { backgroundColor: colors.textSecondary }]} />
            <Text style={[typography.sectionTitle, { color: colors.text }]}>Create a token</Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: 12, lineHeight: 22 }]}>
              1. Open GitHub, then Settings, then Developer settings, then Personal access tokens.{'\n'}
              2. Generate a classic token with the repo and read:user scopes.{'\n'}
              3. Copy it and paste it here. Tempo stores it only in secure storage on this device.
            </Text>
            <PrimaryButton accessibilityLabel="Close help" onPress={() => setHelpVisible(false)} title="Got it" />
            </View>
          </GlassSurface>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
  },
  demoLink: {
    alignItems: 'center',
    marginTop: 28,
    minHeight: 44,
  },
  errorBox: {
    marginTop: 16,
  },
  errorInner: {
    padding: 14,
  },
  githubButton: {
    marginTop: 28,
  },
  grabber: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 5,
    width: 48,
  },
  helpLink: {
    alignItems: 'center',
    marginTop: 16,
    minHeight: 44,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 12,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  markRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalInner: {
    gap: 12,
    padding: 24,
  },
  root: {
    flex: 1,
  },
  tokenToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    minHeight: 44,
  },
  wordmark: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
