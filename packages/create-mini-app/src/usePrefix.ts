import { theme } from './theme.js';

export function usePrefix(status: 'pending' | 'info' | 'completed'): string {
  return theme.prefixes[status];
}