import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#64748B',
    textTransform: 'uppercase',
  },
};

