import { TimeoutError } from 'better-promises';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWindow, mockSessionStorageGetItem, mockWindow } from 'test-utils';
import * as TE from 'fp-ts/TaskEither';

import { requestFp as _requestFp } from '@/utils/request.js';

import { isTMA, isTMAFp } from './isTMA.js';
import { pipe } from 'fp-ts/function';

const requestFp = vi.mocked(_requestFp);

vi.mock('@/utils/request.js', () => ({
  requestFp: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('isTMA', () => {
  describe('complete', () => {
    it('should return true if current window contains TelegramWebviewProxy property', async () => {
      createWindow({ TelegramWebviewProxy: { postEvent: () => undefined } } as any);
      await expect(isTMA('complete')).resolves.toBe(true);
    });

    it(
      'should return promise with true value resolved, if requesting theme parameters was successful',
      async () => {
        createWindow();
        requestFp.mockImplementationOnce(() => TE.right({}));
        await expect(isTMA('complete')).resolves.toBe(true);
      },
    );

    it(
      'should return promise with false value resolved if promise was rejected with timeout error',
      async () => {
        createWindow();
        requestFp.mockImplementationOnce(() => TE.left(new TimeoutError(100)));
        await expect(isTMA('complete')).resolves.toBe(false);

        requestFp.mockImplementationOnce(() => TE.left(new Error('something else')));
        await expect(isTMA('complete')).rejects.toStrictEqual(new Error('something else'));
      },
    );
  });

  describe('sync', () => {
    beforeEach(() => {
      mockWindow({ location: { href: '' } } as any);
      mockSessionStorageGetItem();
    });

    it('should return true if env contains launch params', () => {
      vi
        .spyOn(window.location, 'href', 'get')
        .mockImplementation(() => {
          return '/abc?tgWebAppStartParam=START#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
        });

      expect(isTMA()).toBe(true);
    });

    it('should return true if env doesnt contain launch params', () => {
      expect(isTMA()).toBe(false);
    });
  });
});

describe('isTMAFp', () => {
  describe('complete', () => {
    it('should return true if current window contains TelegramWebviewProxy property', async () => {
      createWindow({ TelegramWebviewProxy: { postEvent: () => undefined } } as any);
      await pipe(
        isTMAFp('complete'),
        TE.match(
          () => expect.unreachable(),
          result => expect(result).toBe(true),
        ),
      )();
    });

    it(
      'should return promise with true value resolved, if requesting theme parameters was successful',
      async () => {
        createWindow();
        requestFp.mockImplementationOnce(() => TE.right({}));
        await pipe(
          isTMAFp('complete'),
          TE.match(
            () => expect.unreachable(),
            result => expect(result).toBe(true),
          ),
        )();
      },
    );

    it(
      'should return promise with false value resolved if promise was rejected with timeout error',
      async () => {
        createWindow();
        requestFp.mockImplementationOnce(() => TE.left(new TimeoutError(100)));
        await pipe(
          isTMAFp('complete'),
          TE.match(
            () => expect.unreachable(),
            result => expect(result).toBe(false),
          ),
        )();

        requestFp.mockImplementationOnce(() => TE.left(new Error('something else')));
        await pipe(
          isTMAFp('complete'),
          TE.match(
            error => expect(error).toBe(new Error('something else')),
            () => expect.unreachable(),
          ),
        )();
      },
    );
  });

  describe('sync', () => {
    beforeEach(() => {
      mockWindow({ location: { href: '' } } as any);
      mockSessionStorageGetItem();
    });

    it('should return true if env contains launch params', () => {
      vi
        .spyOn(window.location, 'href', 'get')
        .mockImplementation(() => {
          return '/abc?tgWebAppStartParam=START#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
        });
      expect(isTMAFp()).toBe(true);
    });

    it('should return true if env doesnt contain launch params', () => {
      expect(isTMAFp()).toBe(false);
    });
  });
});
