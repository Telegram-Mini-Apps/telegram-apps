import { requestViewport } from '@/components/viewport/requestViewport.js';
import { Viewport } from '@/components/viewport/Viewport.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { ExecuteWithTimeout } from '@/types/index.js';

/**
 * Creates new Viewport instance using Mini Apps method.
 * @param postEvent - function to call Mini Apps method.
 * @param options - additional execution options.
 */
export async function initViewportFromRequest(
  postEvent: PostEvent,
  options: ExecuteWithTimeout = {},
): Promise<Viewport> {
  const {
    height,
    width,
    isExpanded,
    isStateStable,
  } = await requestViewport({ ...options, postEvent });

  return new Viewport({
    postEvent,
    height,
    width,
    isExpanded,
    stableHeight: isStateStable ? height : 0,
  });
}
