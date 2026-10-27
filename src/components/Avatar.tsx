import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: number;
}

export function Avatar({ imageUrl, name, size = 48 }: AvatarProps): React.JSX.Element {
  const { colors } = useTheme();
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
  if (imageUrl) {
    return <Image accessibilityLabel={`${name} avatar`} source={{ uri: imageUrl }} style={[styles.image, { height: size, width: size }]} />;
  }
  return (
    <View
      accessibilityLabel={`${name} avatar`}
      style={[styles.fallback, { backgroundColor: colors.primary, height: size, width: size }]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials || 'T'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
  },
  image: {
    borderRadius: 999,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
