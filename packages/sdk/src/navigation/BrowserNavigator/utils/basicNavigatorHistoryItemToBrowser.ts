import type { BasicNavigatorHistoryItem } from '@/navigation/BasicNavigator/types.js';
import type {
  BrowserNavigatorHistoryItem,
  BrowserNavigatorHistoryItemParams,
} from '@/navigation/BrowserNavigator/types.js';

/**
 * Converts basic navigator entry to browser navigator entry.
 */
export function basicNavigatorHistoryItemToBrowser<State>(
  {
    params,
    ...rest
  }: BasicNavigatorHistoryItem<BrowserNavigatorHistoryItemParams<State>>,
): BrowserNavigatorHistoryItem<State> {
  return { ...(params || { hash: '', search: '' }), ...rest };
}
