import { theme } from '../theme.js';

export function usePromptPrefix(completed: boolean): string {
  return theme.prefixes[completed ? 'completed' : 'pending'];
}