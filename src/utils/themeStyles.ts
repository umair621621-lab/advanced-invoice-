import { AccentColor, FontStyle, ThemeStyle } from '../types';

export interface ThemeColorPalette {
  primary: string;
  primaryBg: string;
  primaryBorder: string;
  badgeBg: string;
  badgeText: string;
  headerGradient?: string;
  printHeaderBg?: string;
}

export const ACCENT_MAP: Record<AccentColor, ThemeColorPalette> = {
  indigo: {
    primary: 'text-indigo-600 dark:text-indigo-400',
    primaryBg: 'bg-indigo-600 text-white',
    primaryBorder: 'border-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    headerGradient: 'from-indigo-600 to-indigo-800',
    printHeaderBg: '#4f46e5',
  },
  slate: {
    primary: 'text-slate-800 dark:text-slate-200',
    primaryBg: 'bg-slate-900 text-white',
    primaryBorder: 'border-slate-900',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    badgeText: 'text-slate-800',
    headerGradient: 'from-slate-800 to-slate-950',
    printHeaderBg: '#1e293b',
  },
  emerald: {
    primary: 'text-emerald-600 dark:text-emerald-400',
    primaryBg: 'bg-emerald-600 text-white',
    primaryBorder: 'border-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    headerGradient: 'from-emerald-600 to-teal-800',
    printHeaderBg: '#059669',
  },
  blue: {
    primary: 'text-blue-600 dark:text-blue-400',
    primaryBg: 'bg-blue-600 text-white',
    primaryBorder: 'border-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
    headerGradient: 'from-blue-600 to-indigo-800',
    printHeaderBg: '#2563eb',
  },
  violet: {
    primary: 'text-violet-600 dark:text-violet-400',
    primaryBg: 'bg-violet-600 text-white',
    primaryBorder: 'border-violet-600',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    badgeText: 'text-violet-700',
    headerGradient: 'from-violet-600 to-purple-800',
    printHeaderBg: '#7c3aed',
  },
  rose: {
    primary: 'text-rose-600 dark:text-rose-400',
    primaryBg: 'bg-rose-600 text-white',
    primaryBorder: 'border-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    headerGradient: 'from-rose-600 to-pink-800',
    printHeaderBg: '#e11d48',
  },
  amber: {
    primary: 'text-amber-600 dark:text-amber-400',
    primaryBg: 'bg-amber-600 text-white',
    primaryBorder: 'border-amber-600',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-800',
    headerGradient: 'from-amber-600 to-orange-700',
    printHeaderBg: '#d97706',
  },
};

export const FONT_MAP: Record<FontStyle, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

export function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    case 'Partially Paid':
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
    case 'Overdue':
      return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    case 'Draft':
      return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    case 'Cancelled':
      return 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}
