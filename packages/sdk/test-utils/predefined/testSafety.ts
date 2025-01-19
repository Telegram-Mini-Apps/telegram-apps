import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Signal } from '@telegram-apps/signals';

import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';

import { _version } from '@/globals.js';
import type { AnyFn } from '@/types.js';

import { testIsSupported } from './testIsSupported.js';
import { FunctionUnavailableError } from '@/errors.js';

function cantCallErrPrefix(method: string, component?: string) {
  return `Unable to call the ${component ? `${component}.` : ''}${method}() ${component ? 'method' : 'function'}:`;
}

type FnWithMaybeIsSupported = AnyFn & {
  isSupported?(): boolean;
}

function testShouldBeMounted(fn: AnyFn, component: string, method: string, isMounted: Signal<boolean>) {
  // Require parent component mount.
  it(`should throw ERR_NOT_MOUNTED if ${component} is not mounted`, () => {
    expect(fn).toThrow(
      new FunctionUnavailableError(
        `${cantCallErrPrefix(method, component)} the component is unmounted. Use the ${component}.mount() method`,
      ),
    );
  });

  describe('mounted', () => {
    beforeEach(() => {
      isMounted!.set(true);
    });

    // Check if function is not throwing errors when all requirements were met.
    it('should not throw', () => {
      expect(fn).not.toThrow();
    });
  });
}

export function testSafety(fn: AnyFn, method: string, options: {
  call?: () => any;
  component?: string;
  isMounted?: Signal<boolean>;
}): void;

export function testSafety(fn: FnWithMaybeIsSupported, method: string, options: {
  call?: () => any;
  isMounted?: Signal<boolean>;
  component?: string;
  minVersion?: string;
}): void;

export function testSafety(fn: FnWithMaybeIsSupported, method: string, {
  call,
  component,
  minVersion,
  isMounted,
}: {
  call?: () => any;
  isMounted?: Signal<boolean>;
  component?: string;
  minVersion?: string;
}) {
  let prevVersion: string | undefined;
  if (minVersion) {
    const [a, b = 0] = minVersion.split('.').map(Number);
    prevVersion = `${b === 0 ? a - 1 : a}.${b === 0 ? 99 : b - 1}`;
  }

  const callFn = call || fn;

  // Require running inside Mini Apps.
  it('should throw FunctionUnavailableError if not in Mini Apps', () => {
    const err = new FunctionUnavailableError(
      `${cantCallErrPrefix(method, component)} it can't be called outside Mini Apps`,
    );
    expect(callFn).toThrow(err);
    mockMiniAppsEnv();
    expect(callFn).not.toThrow(err);
  });

  // Require running outside server.
  it('should throw FunctionUnavailableError if called on the server', () => {
    vi
      .spyOn(global, 'window', 'get')
      .mockImplementation(() => undefined as any);
    expect(callFn).toThrow(
      new FunctionUnavailableError(
        `${cantCallErrPrefix(method, component)} it can't be called outside Mini Apps`,
      ),
    );
  });

  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    // Require initializing the SDK.
    it('should throw FunctionUnavailableError if package is not initialized', () => {
      const err = new FunctionUnavailableError(
        `${cantCallErrPrefix(method, component)} the SDK was not initialized. Use the SDK init() function`,
      );
      expect(callFn).toThrow(err);
      _version.set('10');
      expect(callFn).not.toThrow(err);
    });

    if (!fn.isSupported && !isMounted) {
      return;
    }

    describe('package initialized', () => {
      beforeEach(() => {
        _version.set('6.0');
      });

      if (fn.isSupported && minVersion) {
        // Require running with some minimal Mini Apps version.
        it(`should throw FunctionUnavailableError if Mini Apps version is less than ${minVersion}`, () => {
          _version.set(prevVersion!);
          expect(callFn).toThrow(
            new FunctionUnavailableError(
              `${cantCallErrPrefix(method, component)} it is unsupported in Mini Apps version ${prevVersion}`,
            ),
          );

          _version.set(minVersion!);
          expect(callFn).not.toThrow(
            new FunctionUnavailableError(
              `${cantCallErrPrefix(method, component)} it is unsupported in Mini Apps version ${minVersion}`,
            ),
          );
        });

        if (!isMounted) {
          return;
        }

        describe(`Mini Apps version is ${minVersion}`, () => {
          beforeEach(() => {
            _version.set(minVersion!);
          });

          testShouldBeMounted(callFn, component!, method, isMounted);
        });
      } else {
        testShouldBeMounted(callFn, component!, method, isMounted!);
      }
    });
  });

  if (fn.isSupported) {
    describe('isSupported', () => {
      testIsSupported(fn.isSupported!, minVersion!);
    });
  }
}