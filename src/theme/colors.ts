/**
 * Application Color Palette
 * Centralized color definitions for consistent theming across the app
 */

export const Colors = {
  // Brand Colors
  brand: {
    primary: '#009640',
    secondary: '#007A33',
    light: '#E6F5EC',
  },

  // Surface Colors
  surface: '#F3F4F6',
  white: '#FFFFFF',
  black: '#000000',

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#6B7280',
  },

  // Utility Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Status Colors
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    500: '#EF4444',
    800: '#991B1B',
  },

  yellow: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    800: '#92400E',
  },

  blue: {
    50: '#EFF6FF',
    200: '#BFDBFE',
    500: '#3B82F6',
    800: '#1E40AF',
  },

  // Transparent variants
  transparent: 'transparent',
  blackOpacity: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  whiteOpacity: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
};

