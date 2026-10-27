import { usePathname, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '../theme/ThemeProvider';
import { GlassSurface } from './GlassSurface';
import { Icon, type IconName } from './Icon';

interface TabItem {
  icon: IconName;
  iconActive: IconName;
  label: string;
  route: string;
}

const TABS: TabItem[] = [
  { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/(tabs)/home' },
  { icon: 'grid-outline', iconActive: 'grid', label: 'Planner', route: '/(tabs)/planner' },
  { icon: 'clipboard-outline', iconActive: 'clipboard', label: 'Tasks', route: '/(tabs)/tasks' },
  { icon: 'calendar-outline', iconActive: 'calendar', label: 'Calendar', route: '/(tabs)/calendar' },
  { icon: 'person-outline', iconActive: 'person', label: 'Profile', route: '/(tabs)/profile' },
];

function TabButton({ active, onPress, tab }: { active: boolean; onPress: () => void; tab: TabItem }): React.JSX.Element {
  const { colors, glass } = useTheme();
  const fade = useRef(new Animated.Value(active ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(fade, { duration: 180, toValue: active ? 1 : 0, useNativeDriver: true }).start();
  }, [active, fade]);
  return (
    <Pressable
      accessibilityLabel={tab.label}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.94 : 1 }] }]}
    >
      <View style={[styles.button, { backgroundColor: active ? glass.tintLime : 'transparent' }]}>
        <Icon color={active ? colors.text : colors.textSecondary} name={tab.icon} size={22} />
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.iconFill, { opacity: fade }]}>
          <Icon color={colors.text} name={tab.iconActive} size={22} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

export function FloatingTabBar(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isLandscape, isTablet } = useResponsive();
  const vertical = isTablet && isLandscape;

  const go = (route: string): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as never);
  };

  return (
    <View
      style={[
        styles.position,
        vertical ? styles.verticalPos : styles.horizontalPos,
        {
          bottom: vertical ? undefined : insets.bottom + 12,
          left: vertical ? insets.left + 12 : undefined,
          top: vertical ? 80 : undefined,
        },
      ]}
    >
      <GlassSurface radius={999}>
        <View style={vertical ? styles.verticalBar : styles.horizontalBar}>
          {TABS.map((tab) => (
            <TabButton key={tab.route} active={pathname === tab.route} onPress={() => go(tab.route)} tab={tab} />
          ))}
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 999,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  horizontalBar: {
    flexDirection: 'row',
    gap: 4,
    padding: 6,
  },
  horizontalPos: {
    alignSelf: 'center',
  },
  iconFill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  position: {
    position: 'absolute',
    zIndex: 10,
  },
  verticalBar: {
    flexDirection: 'column',
    gap: 4,
    padding: 6,
  },
  verticalPos: {},
});
