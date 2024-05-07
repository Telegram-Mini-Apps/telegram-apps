import {dispatchWindowMessageEvent} from '@test-utils/dispatchWindowMessageEvent.js';
import {afterEach, beforeAll, expect, it, vi} from 'vitest';
import type {FnToSpy} from '@test-utils/types.js';

import {Viewport} from '@/components/Viewport/Viewport.js';

import {bindViewportCSSVars} from './bindViewportCSSVars.js';

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

it('should set a CSS variable following a logic, described in the getCSSVarName argument', () => {
  bindViewportCSSVars(
    new Viewport({
      height: 192,
      width: 1000,
      isExpanded: false,
      stableHeight: 200,
      postEvent: () => null,
    }),
    property => `--my-${property}`
  );

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(3);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--my-height', '192px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--my-width', '1000px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--my-stable-height', '200px');
});
