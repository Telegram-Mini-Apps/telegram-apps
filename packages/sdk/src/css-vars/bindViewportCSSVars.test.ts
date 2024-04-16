import { Viewport } from '@/components/viewport/Viewport.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import type { FnToSpy } from '@test-utils/types.js';
import { afterEach, beforeAll, expect, it, vi } from 'vitest';

import { bindViewportCSSVars } from './bindViewportCSSVars.js';

let setCSSPropertySpy: FnToSpy<typeof document.documentElement.style.setProperty>;

beforeAll(() => {
  setCSSPropertySpy = vi
    .spyOn(document.documentElement.style, 'setProperty')
    .mockImplementation(() => {
    });
});

afterEach(() => {
  vi.clearAllMocks();
});

it('should set --tg-viewport-height = viewport.height, --tg-viewport-width = viewport.width, --tg-viewport-stable-height = viewport.stableHeight', () => {
  bindViewportCSSVars(new Viewport({
    height: 192,
    width: 1000,
    isExpanded: false,
    stableHeight: 200,
    postEvent: () => null,
  }));

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(3);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-height', '192px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-width', '1000px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-stable-height', '200px');
});

it('should update --tg-viewport-height, --tg-viewport-width, --tg-viewport-stable-height according to the values, received in the Viewport change events', () => {
  const viewport = new Viewport({
    height: 192,
    width: 1000,
    isExpanded: false,
    stableHeight: 200,
    postEvent: () => null,
  });
  bindViewportCSSVars(viewport);
  setCSSPropertySpy.mockClear();

  viewport.listen();
  dispatchWindowMessageEvent('viewport_changed', {
    height: 900,
    is_state_stable: true,
    is_expanded: false,
    width: 1800,
  });

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(3);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-height', '900px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-width', '1800px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-stable-height', '900px');
});
