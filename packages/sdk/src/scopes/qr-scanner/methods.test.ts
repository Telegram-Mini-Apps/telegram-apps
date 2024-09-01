import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetPackageState, resetSignal } from '@test-utils/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';

import { $postEvent } from '@/scopes/globals/globals.js';

import { isOpened } from './signals.js';
import { close, open } from './methods.js';

beforeEach(() => {
  resetPackageState();
  resetSignal(isOpened);
  vi.restoreAllMocks();
  $postEvent.set(() => null);
});

describe('close', () => {
  it('should set isOpened = false', () => {
    isOpened.set(true);
    expect(isOpened()).toBe(true);
    close();
    expect(isOpened()).toBe(false);
  });

  it('should call postEvent with "web_app_close_scan_qr_popup"', () => {
    const spy = vi.fn(() => null);
    $postEvent.set(spy);
    expect(spy).toHaveBeenCalledTimes(0);
    close();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_close_scan_qr_popup');
  });
});

describe('open', () => {
  describe('common mode', () => {
    it('should set isOpened = true', () => {
      expect(isOpened()).toBe(false);
      void open({
        capture() {
          return true;
        },
      });
      expect(isOpened()).toBe(true);
    });

    it('should set isOpened = false if QR was scanned', async () => {
      expect(isOpened()).toBe(false);
      const promise = open({
        capture() {
          return true;
        },
      });
      expect(isOpened()).toBe(true);
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR1' });
      await promise;
      expect(isOpened()).toBe(false);
    });

    it('should call postEvent with "web_app_open_scan_qr_popup" with { text: string } and catch "qr_text_received" event returning event "data" property if "capture" returned true', async () => {
      const spy = mockPostEvent();
      const promise = open({
        text: 'TEXT',
        capture(qr) {
          return qr === 'QR2';
        },
      });
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR1' });
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR2' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_open_scan_qr_popup', { text: 'TEXT' });
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
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR1' });
      await promise;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_close_scan_qr_popup');
    });

    it('should return promise with null, if "scan_qr_popup_closed" event was received', async () => {
      const promise = open({
        capture() {
          return true;
        },
      });
      dispatchWindowMessageEvent('scan_qr_popup_closed');
      await expect(promise).resolves.toBeNull();
    });
  });

  describe('stream mode', () => {
    it('should set isOpened = true', () => {
      expect(isOpened()).toBe(false);
      open({
        onCaptured() {
        },
      });
      expect(isOpened()).toBe(true);
    });

    it('should call onCaptured with QR content each time, "qr_text_received" event was received', () => {
      const spy = vi.fn();
      open({ onCaptured: spy });
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR1' });
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR2' });
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'QR1');
      expect(spy).toHaveBeenNthCalledWith(2, 'QR2');
    });

    it('should call postEvent with "web_app_open_scan_qr_popup" with { text: string }', () => {
      const spy = mockPostEvent();
      open({
        text: 'TEXT',
        onCaptured: vi.fn(),
      });
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR1' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_open_scan_qr_popup', { text: 'TEXT' });
    });

    it('should not call onCaptured if QR scanner was closed', () => {
      const spy = vi.fn();
      open({ onCaptured: spy });
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR1' });
      close();
      dispatchWindowMessageEvent('qr_text_received', { data: 'QR2' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('QR1');
    });
  });
});
