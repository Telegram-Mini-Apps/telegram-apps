import { getContextValue, type IContextValue } from './TonConnectContext';
import { type Writable } from 'svelte/store';

export function useTonConnectUI(): Writable<IContextValue> {
  return getContextValue();
}
