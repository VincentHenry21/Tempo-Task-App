import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppMark } from '../src/components/AppMark';
import { GlassSurface } from '../src/components/GlassSurface';
import { Icon } from '../src/components/Icon';
import { welcomeGradient } from '../src/theme/colors';

const SLIDES = [
  { body: 'Tasks, calendar, and weekly hours in one place.', title: 'Plan your week' },
  { body: 'Assigned GitHub issues become tasks automatically.', title: 'Stay in sync' },
  { body: 'Complete a task and its issue closes itself.', title: 'Ship faster' },
];

export default function Welcome(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [demoVisible, setDemoVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide] ?? SLIDES[0];

  return (
    <LinearGradient colors={[...welcomeGradient]} style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <View style={styles.beam} />
      <View style={styles.pillOne} />
      <View style={styles.pillTwo} />
      <View style={styles.wordmarkRow}>
        <AppMark size={32} />
        <Text style={styles.wordmark}>TEMPO</Text>
      </View>
      <View style={styles.hero}>
        <Text style={styles.headlineLight}>AI-Powered</Text>
        <Text style={styles.headline}>Planning for GitHub</Text>
        <Text style={styles.subline}>STAY FOCUSED. SHIP FASTER.</Text>
        <Pressable
          accessibilityLabel="Watch demo"
          accessibilityRole="button"
          onPress={() => {
            setSlide(0);
            setDemoVisible(true);
          }}
          style={styles.demoLink}
        >
          <Text style={styles.demoText}>WATCH DEMO</Text>
          <Icon color="#FFFFFF" name="arrow-forward-outline" size={16} />
        </Pressable>
      </View>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <GlassSurface
          accessibilityLabel="Get started"
          onPress={() => router.push('/login')}
          radius={999}
          tint="rgba(255, 255, 255, 0.9)"
        >
          <View style={styles.startInner}>
            <Text style={styles.startText}>GET STARTED</Text>
          </View>
        </GlassSurface>
      </View>
      <Modal animationType="slide" onRequestClose={() => setDemoVisible(false)} transparent visible={demoVisible}>
        <View style={styles.modalBackdrop}>
          <GlassSurface radius={32} strong style={styles.modalCard}>
            <View style={styles.modalInner}>
            <View style={styles.grabber} />
            <Text style={styles.modalKicker}>TEMPO TOUR</Text>
            <Text style={styles.modalTitle}>{current.title}</Text>
            <Text style={styles.modalBody}>{current.body}</Text>
            <View style={styles.dots}>
              {SLIDES.map((item, index) => (
                <View key={item.title} style={[styles.dot, index === slide ? styles.dotActive : null]} />
              ))}
            </View>
            <View style={styles.modalRow}>
              <Pressable accessibilityLabel="Close demo" accessibilityRole="button" onPress={() => setDemoVisible(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </Pressable>
              <Pressable
                accessibilityLabel={slide < SLIDES.length - 1 ? 'Next slide' : 'Finish demo'}
                accessibilityRole="button"
                onPress={() => {
                  if (slide < SLIDES.length - 1) {
                    setSlide(slide + 1);
                  } else {
                    setDemoVisible(false);
                  }
                }}
              >
                <Text style={styles.modalNext}>{slide < SLIDES.length - 1 ? 'Next' : 'Done'}</Text>
              </Pressable>
            </View>
            </View>
          </GlassSurface>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  grabber: {
    alignSelf: 'center',
    backgroundColor: '#9AA3B2',
    borderRadius: 999,
    height: 5,
    marginBottom: 16,
    width: 48,
  },
  beam: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    height: 340,
    position: 'absolute',
    right: -60,
    top: -140,
    transform: [{ rotate: '24deg' }],
    width: 180,
  },
  bottom: {
    paddingHorizontal: 24,
  },
  demoLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 28,
    minHeight: 44,
  },
  demoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
  dot: {
    backgroundColor: '#D6DCE8',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: '#4272FF',
    width: 22,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '500',
    lineHeight: 42,
  },
  headlineLight: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 42,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBody: {
    color: '#5F6672',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  modalCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalInner: {
    padding: 24,
  },
  modalClose: {
    color: '#5F6672',
    fontSize: 16,
    fontWeight: '500',
  },
  modalKicker: {
    color: '#4272FF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  modalNext: {
    color: '#4272FF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalTitle: {
    color: '#111418',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  pillOne: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    height: 180,
    position: 'absolute',
    right: -70,
    top: 160,
    width: 140,
  },
  pillTwo: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    height: 120,
    position: 'absolute',
    right: -40,
    top: 380,
    width: 100,
  },
  root: {
    flex: 1,
  },
  startInner: {
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  startText: {
    color: '#0A1FB8',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    letterSpacing: 3,
    marginTop: 16,
  },
  wordmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 4,
  },
  wordmarkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
  },
});
