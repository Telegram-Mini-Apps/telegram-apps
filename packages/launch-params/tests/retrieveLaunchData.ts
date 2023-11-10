import type { SpyInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockWindow } from 'test-utils';

import * as computeLaunchDataModule from '../src/computeLaunchData.js';
import * as storageModule from '../src/storage.js';
import { retrieveLaunchData } from '../src/retrieveLaunchData.js';

vi.mock('../src/computeLaunchData.js', () => ({
  computeLaunchData: vi.fn(),
}));

vi.mock('../src/storage.js', () => ({
  saveToStorage: vi.fn(),
}));

let computeLaunchDataSpy: SpyInstance;
let saveToStorageSpy: SpyInstance;

beforeEach(() => {
  computeLaunchDataSpy = vi.spyOn(computeLaunchDataModule, 'computeLaunchData');
  saveToStorageSpy = vi.spyOn(storageModule, 'saveToStorage');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('retrieveLaunchData', () => {
  it('should return value stored in window.tmajsLaunchData in case it exists', () => {
    mockWindow({ tmajsLaunchData: 'something cached' } as any);
    expect(retrieveLaunchData()).toBe('something cached');
  });

  it('should create property window.tmajsLaunchData and save the result of computeLaunchData function', () => {
    mockWindow();
    const launchData = {
      launchParams: {
        themeParams: {},
        version: '7.0',
        platform: 'macos',
      },
      isPageReload: true,
    };
    computeLaunchDataSpy.mockImplementationOnce(() => launchData);

    retrieveLaunchData();
    expect((window as any).tmajsLaunchData).toStrictEqual(launchData);
  });

  it('should call saveToStorage function with launch data launch parameters to save data', () => {
    mockWindow();
    const launchData = {
      launchParams: {
        themeParams: {},
        version: '7.0',
        platform: 'macos',
      },
      isPageReload: true,
    };
    computeLaunchDataSpy.mockImplementationOnce(() => launchData);

    retrieveLaunchData();
    expect(saveToStorageSpy).toBeCalledTimes(1);
    expect(saveToStorageSpy).toHaveBeenCalledWith(launchData.launchParams);
  });

  it('should return result of computeLaunchData', () => {
    mockWindow();
    const launchData = {
      launchParams: {
        themeParams: {},
        version: '7.0',
        platform: 'macos',
      },
      isPageReload: true,
    };
    computeLaunchDataSpy.mockImplementationOnce(() => launchData);

    expect(retrieveLaunchData()).toStrictEqual(launchData);
  });
});
