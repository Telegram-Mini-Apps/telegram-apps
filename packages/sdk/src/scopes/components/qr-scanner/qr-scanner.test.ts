import { beforeEach, describe, expect, it, vi } from 'vitest';
import { emitEvent } from '@telegram-apps/bridge';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

import { close, open, isSupported } from './qr-scanner.js';

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
  testSafety(fn, name, {
    component: 'qrScanner',
    minVersion: '6.4',
  });
});

describe('isSupported', () => {
  testIsSupported(isSupported, '6.4');
});

describe('close', () => {
  beforeEach(setAvailable);

  it('should call postEvent with "web_app_close_scan_qr_popup"', () => {
    const spy = mockPostEvent();
    expect(spy).toHaveBeenCalledTimes(0);
    close();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_close_scan_qr_popup', undefined);
  });
});

describe('capture one', () => {
  beforeEach(setAvailable);

  it('should call "web_app_open_scan_qr_popup" method with { text: string } and catch "qr_text_received" event returning event "data" property if "capture" returned true', async () => {
    const spy = mockPostEvent();
    const promise = open({
      text: 'TEXT',
      capture(qr) {
        return qr === 'QR2';
      },
    });
    emitEvent('qr_text_received', { data: 'QR1' });
    emitEvent('qr_text_received', { data: 'QR2' });
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
    emitEvent('qr_text_received', { data: 'QR1' });
    await promise;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_close_scan_qr_popup', undefined);
  });

  it('should call "web_app_close_scan_qr_popup" if QR was scanned', async () => {
    const spy = mockPostEvent();
    const promise = open();
    spy.mockClear();
    emitEvent('qr_text_received', { data: 'QR1' });
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
    emitEvent('scan_qr_popup_closed');
    await expect(promise).resolves.toBeUndefined();
  });
})

describe('capture many', () => {
  beforeEach(setAvailable);

  it('should call onCaptured with QR content each time, "qr_text_received" event was received', () => {
    const spy = vi.fn();
    void open({ onCaptured: spy });
    emitEvent('qr_text_received', { data: 'QR1' });
    emitEvent('qr_text_received', { data: 'QR2' });
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
    emitEvent('qr_text_received', { data: 'QR1' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_open_scan_qr_popup', { text: 'TEXT' });
  });

  it('should not call onCaptured if QR scanner was closed', async () => {
    const spy = vi.fn();
    const promise = open({ onCaptured: spy });
    emitEvent('qr_text_received', { data: 'QR1' });
    close();
    await promise;
    emitEvent('qr_text_received', { data: 'QR2' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('QR1');
  });
});
