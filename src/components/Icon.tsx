import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

export type IconName =
  | 'add'
  | 'add-circle'
  | 'add-outline'
  | 'arrow-forward-outline'
  | 'arrow-up'
  | 'arrow-up-outline'
  | 'calendar'
  | 'calendar-outline'
  | 'checkmark-circle'
  | 'checkmark-circle-outline'
  | 'chevron-back'
  | 'chevron-back-outline'
  | 'chevron-forward'
  | 'chevron-forward-outline'
  | 'clipboard'
  | 'clipboard-outline'
  | 'cloud-offline'
  | 'cloud-offline-outline'
  | 'code-slash-outline'
  | 'color-palette-outline'
  | 'ellipse-outline'
  | 'flag'
  | 'flag-outline'
  | 'git-branch'
  | 'git-branch-outline'
  | 'grid'
  | 'grid-outline'
  | 'home'
  | 'home-outline'
  | 'key-outline'
  | 'link'
  | 'link-outline'
  | 'log-out'
  | 'log-out-outline'
  | 'logo-github'
  | 'moon'
  | 'moon-outline'
  | 'notifications'
  | 'notifications-outline'
  | 'options'
  | 'options-outline'
  | 'person'
  | 'person-outline'
  | 'search'
  | 'search-outline'
  | 'sparkles'
  | 'sparkles-outline'
  | 'sunny'
  | 'sunny-outline'
  | 'sync'
  | 'sync-outline'
  | 'time'
  | 'time-outline'
  | 'trash'
  | 'trash-outline';

interface IconProps {
  color?: string;
  name: IconName;
  size?: number;
}

export function Icon({ color, name, size = 22 }: IconProps): React.JSX.Element {
  const { colors } = useTheme();
  return <Ionicons color={color ?? colors.text} name={name} size={size} />;
}
