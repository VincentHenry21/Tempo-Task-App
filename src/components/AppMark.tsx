import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface AppMarkProps {
  size?: number;
}

/**
 * Tempo app mark drawn with SVG: three rising frosted-glass pills over a deep
 * blue gradient, with a lime dot above the middle pill. Mirrors the generated
 * app icon (scripts/generate-icons.js) so branding shows even before the PNG
 * icons are generated.
 */
export function AppMark({ size = 64 }: AppMarkProps): React.JSX.Element {
  return (
    <Svg height={size} width={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="appmark-bg" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor="#6F93FF" />
          <Stop offset="0.55" stopColor="#3D63FF" />
          <Stop offset="1" stopColor="#1A2FC9" />
        </LinearGradient>
        <LinearGradient id="appmark-glass" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.8} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.24} />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#appmark-bg)" height={64} rx={14} width={64} />
      <Rect fill="#FFFFFF" height={20} opacity={0.14} rx={10} width={34} x={6} y={2} />
      <Rect fill="url(#appmark-glass)" height={19} rx={4.7} stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={0.5} width={9.4} x={14.5} y={29.5} />
      <Rect fill="url(#appmark-glass)" height={27.5} rx={4.7} stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={0.5} width={9.4} x={27.3} y={20.8} />
      <Rect fill="url(#appmark-glass)" height={36} rx={4.7} stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={0.5} width={9.4} x={40.1} y={12} />
      <Circle cx={32} cy={16.4} fill="#E3F4A0" r={3.6} />
      <Rect height={4} opacity={0.38} rx={2} width={5.4} x={16.5} y={30.6} />
      <Rect height={4} opacity={0.38} rx={2} width={5.4} x={29.3} y={21.9} />
      <Rect height={4} opacity={0.38} rx={2} width={5.4} x={42.1} y={13.1} />
    </Svg>
  );
}
