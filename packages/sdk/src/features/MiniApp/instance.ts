import { pipe } from 'fp-ts/function';
import { on, off } from '@tma.js/bridge';

import { MiniApp, type MiniAppState } from '@/features/MiniApp/MiniApp.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withPostEvent } from '@/fn-options/withPostEvent.js';
import { withVersion } from '@/fn-options/withVersion.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';
import { themeParams } from '@/features/ThemeParams/instance.js';

export const miniApp = new MiniApp({
  ...pipe(
    sharedFeatureOptions(),
    withPostEvent,
    withVersion,
    withStateRestore<MiniAppState>('miniApp'),
  ),
  offVisibilityChanged(listener) {
    off('visibility_changed', listener);
  },
  onVisibilityChanged(listener) {
    on('visibility_changed', listener);
  },
  theme: themeParams.state,
});
