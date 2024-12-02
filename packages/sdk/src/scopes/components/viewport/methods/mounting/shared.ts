import type { EventListener } from '@telegram-apps/bridge';

import { setState } from '../../signals/state.js';

export const onViewportChanged: EventListener<'viewport_changed'> = (data) => {
  const { height } = data;
  setState({
    isExpanded: data.is_expanded,
    height,
    width: data.width,
    stableHeight: data.is_state_stable ? height : undefined,
  });
};

export const onFullscreenChanged: EventListener<'fullscreen_changed'> = (data) => {
  setState({ isFullscreen: data.is_fullscreen });
};
