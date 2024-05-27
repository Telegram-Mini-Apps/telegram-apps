import figures from 'figures';

import { theme } from '../theme.js';

export function useInputPrefix(completed: boolean): string {
  return theme.style.muted(completed ? figures.ellipsis : figures.pointerSmall);
}