import {useCallback, useState} from 'react';

/**
 * Hook which returns function used for force update.
 */
export function useForceUpdate(): (() => void) {
  const [, setHash] = useState(0);
  return useCallback(() => setHash(hash => (hash + 1) % 1_000_000), []);
}