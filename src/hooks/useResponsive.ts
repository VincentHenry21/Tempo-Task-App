import { useWindowDimensions } from 'react-native';

export interface Responsive {
  columns: number;
  contentMaxWidth: number;
  isLandscape: boolean;
  isTablet: boolean;
  scale: (value: number) => number;
  width: number;
}

export function useResponsive(): Responsive {
  const { height, width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const columns = isTablet && isLandscape ? 2 : 1;
  const contentMaxWidth = isTablet ? (isLandscape ? 1080 : 720) : 640;
  const scale = (value: number): number => {
    if (!isTablet) {
      return value;
    }
    return Math.round(value * 1.15);
  };
  return { columns, contentMaxWidth, isLandscape, isTablet, scale, width };
}
