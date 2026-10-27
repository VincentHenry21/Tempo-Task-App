import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

interface OrbProps {
  animate: boolean;
  color: string;
  dx: number;
  duration: number;
  dy: number;
  id: string;
  opacity: number;
  size: number;
  x: number;
  y: number;
}

function Orb({ animate, color, dx, duration, dy, id, opacity, size, x, y }: OrbProps): React.JSX.Element {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!animate) {
      t.value = 0;
      return;
    }
    t.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [animate, duration, t]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: t.value * dx }, { translateY: t.value * dy }, { scale: 1 + t.value * 0.08 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ height: size, left: x, position: 'absolute', top: y, width: size }, style]}
    >
      <Svg height={size} width={size}>
        <Defs>
          <RadialGradient cx="50%" cy="50%" id={id} r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} fill={`url(#${id})`} r={size / 2} />
      </Svg>
    </Animated.View>
  );
}

function AmbientBackgroundInner(): React.JSX.Element {
  const { ambient, reduceTransparency } = useTheme();
  const { height, width } = useWindowDimensions();
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduced) => setAnimate(!reduced))
      .catch(() => undefined);
  }, []);
  const shouldAnimate = animate && !reduceTransparency;
  const big = Math.max(width, height);
  const layout = [
    { dx: 60, dy: 40, duration: 16000, size: 0.95 * big, x: -0.25 * big, y: -0.15 * big },
    { dx: -50, dy: 60, duration: 19000, size: 0.8 * big, x: 0.35 * width, y: 0.2 * height },
    { dx: 70, dy: -50, duration: 14000, size: 0.85 * big, x: -0.2 * width, y: 0.55 * height },
    { dx: -40, dy: -60, duration: 21000, size: 0.7 * big, x: 0.45 * width, y: 0.7 * height },
  ];
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={[...ambient.base]} style={StyleSheet.absoluteFill} />
      {layout.map((orb, index) => (
        <Orb
          key={orb.x}
          animate={shouldAnimate}
          color={ambient.orbs[index]?.color ?? '#4272FF'}
          dx={orb.dx}
          duration={orb.duration}
          dy={orb.dy}
          id={`orb${index}`}
          opacity={ambient.orbs[index]?.opacity ?? 0.3}
          size={orb.size}
          x={orb.x}
          y={orb.y}
        />
      ))}
    </View>
  );
}

export const AmbientBackground = memo(AmbientBackgroundInner);
