import { expect, vi, it, SpyInstance, afterEach, beforeAll } from 'vitest';
import { bindViewportCSSVars } from '../bindViewportCSSVars';
import { dispatchWindowMessageEvent } from '../../../test-utils/dispatchWindowMessageEvent';
import { Viewport } from '../../components/viewport/Viewport';

let setCSSPropertySpy: SpyInstance<[string, string, string?], void>;

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
  });
  bindViewportCSSVars(viewport);
  setCSSPropertySpy.mockClear();

  viewport.listen();
  dispatchWindowMessageEvent('viewport_changed', {
    height: 900,
    is_state_stable: true,
    is_expanded: false,
    width: 1800,
  })

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(3);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-height', '900px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-width', '1800px');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-viewport-stable-height', '900px');
});
