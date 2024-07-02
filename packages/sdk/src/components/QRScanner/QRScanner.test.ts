import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createWindow } from '@test-utils/createWindow.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';

import { QRScanner } from './QRScanner.js';

beforeEach(() => {
  createWindow();
});

afterEach(() => {
  vi.restoreAllMocks();
  resetMiniAppsEventEmitter();
});

describe('open', () => {
  it('should call the web_app_open_scan_qr_popup method with the specified text', async () => {
    const postEvent = vi.fn();
    const qr = new QRScanner(false, '10', postEvent);
    qr.open('Scan a QR');

    expect(postEvent).toBeCalledTimes(1);
    expect(postEvent).toBeCalledWith('web_app_open_scan_qr_popup', {
      text: 'Scan a QR',
    });
  });

  it('should resolve with null if the scan_qr_popup_closed event was received', async () => {
    const qr = new QRScanner(false, '10', vi.fn() as any);
    const promise = qr.open('Scan a QR');

    dispatchWindowMessageEvent('scan_qr_popup_closed', {});

    await expect(promise).resolves.toBeNull();
  });

  it('should resolve with qr context specified in the qr_text_received event', async () => {
    const qr = new QRScanner(false, '10', vi.fn() as any);
    const promise = qr.open('Scan a QR');

    dispatchWindowMessageEvent('qr_text_received', {
      data: 'qr content',
    });

    await expect(promise).resolves.toBe('qr content');
  });

  it('should throw an error, if the scanner was opened several times without closing', async () => {
    const qr = new QRScanner(false, '10', vi.fn() as any);
    qr.open('Scan a QR');
    await expect(qr.open('again')).rejects.toThrow('The scanner is already opened');
  });

  it('should set isOpened = true after call and false after qr_text_received or scan_qr_popup_closed events were called', async () => {
    const qr = new QRScanner(false, '10', vi.fn() as any);

    expect(qr.isOpened).toBe(false);
    let promise = qr.open();
    expect(qr.isOpened).toBe(true);
    dispatchWindowMessageEvent('qr_text_received', {
      data: 'qr content',
    });
    await promise;
    expect(qr.isOpened).toBe(false);

    promise = qr.open();
    expect(qr.isOpened).toBe(true);
    dispatchWindowMessageEvent('scan_qr_popup_closed', {});
    await promise;
    expect(qr.isOpened).toBe(false);
  });
});