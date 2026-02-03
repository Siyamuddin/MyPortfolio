/**
 * Color Design Tokens
 * Centralized color system for the application
 */

export const colors = {
  // Primary colors
  primary: {
    main: '#854CE6',
    light: '#A570F0',
    dark: '#6B3DB8',
    contrast: '#FFFFFF',
  },
  
  // Secondary colors
  secondary: {
    main: '#be1adb',
    light: '#D84DF5',
    dark: '#9615B0',
    contrast: '#FFFFFF',
  },
  
  // Background colors
  background: {
    dark: '#1C1C27',
    darkLight: '#1C1E27',
    light: '#FFFFFF',
    lightSecondary: '#f0f0f0',
  },
  
  // Text colors
  text: {
    primary: {
      dark: '#F2F3F4',
      light: '#111111',
    },
    secondary: {
      dark: '#b1b2b3',
      light: '#48494a',
    },
    disabled: '#9E9E9E',
  },
  
  // Card colors
  card: {
    dark: '#171721',
    darkLight: '#191924',
    light: '#FFFFFF',
  },
  
  // Status colors
  status: {
    success: '#4CAF50',
    error: '#f44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },
  
  // Overlay colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.8)',
  },
} as const;

export type ColorToken = typeof colors;
