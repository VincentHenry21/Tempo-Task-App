import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { radii } from '../theme/colors';
import { GlassSurface } from './GlassSurface';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  strong?: boolean;
  style?: ViewStyle;
  testID?: string;
  tint?: string;
}

export function Card({ children, onPress, strong, style, testID, tint }: CardProps): React.JSX.Element {
  return (
    <GlassSurface
      accessibilityLabel={testID}
      onPress={onPress}
      radius={radii.card}
      strong={strong}
      style={style}
      tint={tint}
    >
      <View style={styles.inner}>{children}</View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  inner: {
    padding: 16,
  },
});
