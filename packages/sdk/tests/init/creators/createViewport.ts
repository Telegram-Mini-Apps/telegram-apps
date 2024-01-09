import { it, vi, afterEach, expect, SpyInstance } from 'vitest';
import { mockSessionStorageGetItem } from 'test-utils';

import { createViewport } from '~/init/creators/createViewport.js';
import { createWindow } from '~test-utils/createWindow.js';
import { requestViewport } from '~/viewport/requestViewport.js';

vi.mock('~/viewport/requestViewport.js', () => {
  return {
    requestViewport: vi.fn(),
  };
});

const requestViewportMock =
  requestViewport as unknown as SpyInstance<Parameters<typeof requestViewport>, ReturnType<typeof requestViewport>>;

afterEach(() => {
  vi.restoreAllMocks();
  requestViewportMock.mockReset();
});

it('should create Viewport from the data located in the storage if page was reloaded and storage has viewport data', () => {
  mockSessionStorageGetItem('{"height":992,"isExpanded":false,"stableHeight":992,"width":320}');
  expect(createViewport(true, 'macos', vi.fn(), false)).toMatchObject({
    height: 992,
    isExpanded: false,
    stableHeight: 992,
    width: 320,
  });
});

it('should return viewport with window data if page was not reloaded or storage is missing required data, and platform has a stable viewport', () => {
  createWindow({ innerHeight: 1000, innerWidth: 2000 });
  expect(createViewport(false, 'macos', vi.fn(), false)).toMatchObject({
    height: 1000,
    isExpanded: true,
    stableHeight: 1000,
    width: 2000,
  });

  expect(createViewport(true, 'macos', vi.fn(), false)).toMatchObject({
    height: 1000,
    isExpanded: true,
    stableHeight: 1000,
    width: 2000,
  });
});

it('should create Viewport instance from the result of calling requestViewport function if page was not reloaded, platform has no stable viewport and initialization is complete', () => {
  requestViewportMock.mockImplementation(async () => ({
    height: 922,
    isStateStable: false,
    width: 800,
    isExpanded: false,
  }));

  expect(createViewport(false, 'android', vi.fn(), true)).resolves.toMatchObject({
    height: 922,
    isExpanded: false,
    stableHeight: 0,
    width: 800,
  });

  requestViewportMock.mockImplementation(async () => ({
    height: 111,
    isStateStable: true,
    width: 222,
    isExpanded: true,
  }));

  expect(createViewport(false, 'android', vi.fn(), true)).resolves.toMatchObject({
    height: 111,
    isExpanded: true,
    stableHeight: 111,
    width: 222,
  });
});

it('should return viewport with zeroes if page was reloaded, storage doesnt contain data, platform has no stable viewport and initialization is not complete', () => {
  requestViewportMock.mockImplementation(async () => ({
    height: 922,
    isStateStable: false,
    width: 800,
    isExpanded: false,
  }));

  mockSessionStorageGetItem(null);
  expect(createViewport(true, 'android', vi.fn(), false)).toMatchObject({
    height: 0,
    isExpanded: false,
    stableHeight: 0,
    width: 0,
  });
});
