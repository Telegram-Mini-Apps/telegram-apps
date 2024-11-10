import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent } from 'test-utils';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { $version } from '@/scopes/globals.js';

import { close, open, isOpened, isSupported } from './qr-scanner.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
}

describe.each([
  ['close', close],
  ['open', open],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the qrScanner.${name}() method: it can't be called outside Mini Apps`,
    );
    expect(fn).toThrow(err);
    mockMiniAppsEnv();
    expect(fn).not.toThrow(err);
  });

  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    it('should throw ERR_UNKNOWN_ENV if called on the server', () => {
      mockSSR();
      expect(fn).toThrow(
        new TypedError(
          'ERR_UNKNOWN_ENV',
          `Unable to call the qrScanner.${name}() method: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the qrScanner.${name}() method: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setMaxVersion();
      expect(fn).not.toThrow(err);
    });

    describe('package initialized', () => {
      beforeEach(setMaxVersion);

      it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 6.4', () => {
        $version.set('6.3');
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the qrScanner.${name}() method: it is unsupported in Mini Apps version 6.3`,
          ),
        );
        $version.set('6.4');
        expect(fn).not.toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the qrScanner.${name}() method: it is unsupported in Mini Apps version 6.4`,
          ),
        );
      });
    });
  });

  describe('isSupported', () => {
    it('should return true only if Mini Apps version is 6.4 or higher. False otherwise', () => {
      $version.set('6.3');
      expect(fn.isSupported()).toBe(false);
      $version.set('6.4');
      expect(fn.isSupported()).toBe(true);
    });
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 6.4', () => {
    $version.set('6.3');
    expect(isSupported()).toBe(false);

    $version.set('6.4');
    expect(isSupported()).toBe(true);
  });
});

describe('close', () => {
  beforeEach(setAvailable);

  it('should set isOpened = false', () => {
    isOpened.set(true);
    expect(isOpened()).toBe(true);
    close();
    expect(isOpened()).toBe(false);
  });

  it('should call postEvent with "web_app_close_scan_qr_popup"', () => {
    const spy = mockPostEvent();
    expect(spy).toHaveBeenCalledTimes(0);
    close();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_close_scan_qr_popup', undefined);
  });
});

describe('open', () => {
  beforeEach(setAvailable);

  describe('common mode', () => {
    it('should call "web_app_open_scan_qr_popup" method with { text: string } and catch "qr_text_received" event returning event "data" property if "capture" returned true', async () => {
      const spy = mockPostEvent();
      const promise = open({
        text: 'TEXT',
        capture(qr) {
          return qr === 'QR2';
        },
      });
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR1' });
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR2' });
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'web_app_open_scan_qr_popup', { text: 'TEXT' });
      expect(spy).toHaveBeenNthCalledWith(2, 'web_app_close_scan_qr_popup', undefined);
      await expect(promise).resolves.toBe('QR2');
    });

    it('should call "web_app_close_scan_qr_popup" if QR was scanned', async () => {
      const spy = mockPostEvent();
      const promise = open({
        capture() {
          return true;
        },
      });
      spy.mockClear();
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR1' });
      await promise;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_close_scan_qr_popup', undefined);
    });

    it('should call "web_app_close_scan_qr_popup" if QR was scanned', async () => {
      const spy = mockPostEvent();
      const promise = open();
      spy.mockClear();
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR1' });
      await promise;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        'web_app_close_scan_qr_popup',
        undefined,
      );
    });

    it('should return promise with undefined if "scan_qr_popup_closed" event was received', async () => {
      const promise = open({
        capture() {
          return true;
        },
      });
      dispatchMiniAppsEvent('scan_qr_popup_closed');
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('stream mode', () => {
    it('should call onCaptured with QR content each time, "qr_text_received" event was received', () => {
      const spy = vi.fn();
      void open({ onCaptured: spy });
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR1' });
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR2' });
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'QR1');
      expect(spy).toHaveBeenNthCalledWith(2, 'QR2');
    });

    it('should call postEvent with "web_app_open_scan_qr_popup" with { text: string }', () => {
      const spy = mockPostEvent();
      void open({
        text: 'TEXT',
        onCaptured: vi.fn(),
      });
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR1' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_open_scan_qr_popup', { text: 'TEXT' });
    });

    it('should not call onCaptured if QR scanner was closed', async () => {
      const spy = vi.fn();
      const promise = open({ onCaptured: spy });
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR1' });
      close();
      await promise;
      dispatchMiniAppsEvent('qr_text_received', { data: 'QR2' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('QR1');
    });
  });
});
