import type { BasicNavigatorHistoryItem } from '@/Navigator/types.js';
import type {
  BrowserNavigatorHistoryItem,
  BrowserNavigatorHistoryItemParams,
} from '@/browser/BrowserNavigator/types.js';

/**
 * Converts basic navigator entry to browser navigator entry.
 */
export function basicItemToBrowser<State>(
  {
    params,
    ...rest
  }: BasicNavigatorHistoryItem<BrowserNavigatorHistoryItemParams<State>>,
): BrowserNavigatorHistoryItem<State> {
  return { ...(params || { hash: '', search: '' }), ...rest };
}
