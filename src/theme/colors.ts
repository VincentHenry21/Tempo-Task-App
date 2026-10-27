export interface ThemeColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  primary: string;
  primaryPressed: string;
  accentLime: string;
  limeStrong: string;
  text: string;
  textSecondary: string;
  chartIdle: string;
  divider: string;
  welcomeBackdrop: string;
  limeTextOnDark: string;
  danger: string;
  success: string;
  cardBorder: string;
  shadow: boolean;
}

export const lightColors: ThemeColors = {
  background: '#F6F8F6',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  primary: '#4272FF',
  primaryPressed: '#3260EA',
  accentLime: '#EAF9B8',
  limeStrong: '#E3F4A0',
  text: '#111418',
  textSecondary: '#5F6672',
  chartIdle: '#EBEBEB',
  divider: '#E6E9EC',
  welcomeBackdrop: '#C9D6FF',
  limeTextOnDark: '#1E2A08',
  danger: '#E5484D',
  success: '#2E9E5B',
  cardBorder: '#E6E9EC',
  shadow: true,
};

export const darkColors: ThemeColors = {
  background: '#0D1017',
  surface: '#171B24',
  surfaceRaised: '#1F2430',
  primary: '#5B86FF',
  primaryPressed: '#4272FF',
  accentLime: '#2A3318',
  limeStrong: '#2A3318',
  text: '#F2F4F7',
  textSecondary: '#9AA3B2',
  chartIdle: '#2A2F3A',
  divider: '#262B36',
  welcomeBackdrop: '#C9D6FF',
  limeTextOnDark: '#D8F27A',
  danger: '#FF6B70',
  success: '#4CC07A',
  cardBorder: '#262B36',
  shadow: false,
};

export interface GlassTokens {
  fill: string;
  fillStrong: string;
  border: string;
  highlight: string;
  shadow: string;
  shadowOpacity: number;
  blur: number;
  tintBlue: string;
  tintLime: string;
}

export interface AmbientOrb {
  color: string;
  opacity: number;
}

export interface AmbientTokens {
  base: readonly [string, string];
  orbs: readonly AmbientOrb[];
}

export const glassLight: GlassTokens = {
  fill: 'rgba(255,255,255,0.55)',
  fillStrong: 'rgba(255,255,255,0.72)',
  border: 'rgba(255,255,255,0.90)',
  highlight: 'rgba(255,255,255,0.60)',
  shadow: '#1B2A5A',
  shadowOpacity: 0.12,
  blur: 40,
  tintBlue: 'rgba(66,114,255,0.88)',
  tintLime: 'rgba(227,244,160,0.80)',
};

export const glassDark: GlassTokens = {
  fill: 'rgba(30,36,52,0.45)',
  fillStrong: 'rgba(36,43,62,0.65)',
  border: 'rgba(255,255,255,0.14)',
  highlight: 'rgba(255,255,255,0.14)',
  shadow: '#000000',
  shadowOpacity: 0.35,
  blur: 55,
  tintBlue: 'rgba(91,134,255,0.80)',
  tintLime: 'rgba(60,72,24,0.75)',
};

export const ambientLight: AmbientTokens = {
  base: ['#EAF0FF', '#F4F8EC'],
  orbs: [
    { color: '#4272FF', opacity: 0.45 },
    { color: '#D9F27A', opacity: 0.55 },
    { color: '#A78BFA', opacity: 0.3 },
    { color: '#7DD3FC', opacity: 0.35 },
  ],
};

export const ambientDark: AmbientTokens = {
  base: ['#070A12', '#0D1220'],
  orbs: [
    { color: '#3555FF', opacity: 0.5 },
    { color: '#7C4DFF', opacity: 0.35 },
    { color: '#14B8A6', opacity: 0.22 },
    { color: '#B7D94A', opacity: 0.12 },
  ],
};

export const radii = {
  card: 24,
  hero: 28,
  tile: 22,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const welcomeGradient: readonly [string, string] = ['#0A1FB8', '#3B63FF'];
