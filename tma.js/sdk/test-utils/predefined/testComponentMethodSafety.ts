import { describe, expect, it } from 'vitest';
import { Version } from '@tma.js/types';

import { FunctionUnavailableError } from '@/errors.js';

import { testIsSupported } from './testIsSupported.js';

type Options<C> = {
  /**
   * Creates a new component instance.
   * @param opts
   */
  instantiate: (opts: { isTma: boolean; version: string }) => C;
  /**
   * Mounts the component.
   */
  mount?: (component: C) => void | Promise<void>;
  /**
   * Attempts to call component method.
   * @param component
   */
  try: (component: C) => any;
} & ({
  /**
   * Retrieves component method.
   * @param component
   */
  get: (component: C) => {
    isSupported: () => boolean;
    isAvailable: () => boolean;
  };
  /**
   * Minimal version for the method to be supported.
   */
  minVersion: Version;
} | {
  /**
   * Retrieves component method.
   * @param component
   */
  get: (component: C) => {
    isAvailable: () => boolean;
  };
});

export function testComponentMethodSafety<C>(options: Options<C>) {
  const {
    instantiate,
    try: tryCall,
    get,
    mount,
  } = options;
  const hasMinVersion = 'minVersion' in options;
  const versions: { prev: string; min: string } | undefined =
    hasMinVersion
      ? (() => {
        const [a, b = 0] = options.minVersion.split('.').map(Number);
        return {
          prev: `${b === 0 ? a - 1 : a}.${b === 0 ? 99 : b - 1}`,
          min: options.minVersion,
        };
      })()
      : { prev: '99.9', min: '100' };

  describe.runIf(hasMinVersion)('isSupported', () => {
    testIsSupported(
      version => {
        return options.get(instantiate({ isTma: true, version })) as {
          isAvailable: () => boolean;
          isSupported(): boolean;
        };
      },
      versions.min,
    );
  });

  describe('isAvailable', () => {
    it('should return false if not mini apps env', () => {
      expect(get(instantiate({ isTma: false, version: versions.min })).isAvailable()).toBe(false);
    });

    describe('mini apps env', () => {
      describe.runIf(hasMinVersion)(() => {
        it('should return false if version is "0.0" (SDK not initialized)', () => {
          expect(get(instantiate({ isTma: true, version: '0.0' })).isAvailable()).toBe(false);
        });

        it(`should return false if version is less than ${versions.min}`, () => {
          expect(get(instantiate({
            isTma: true,
            version: versions.prev,
          })).isAvailable()).toBe(false);
        });

        it.runIf(!mount)(`should return true if version is ${versions.min}`, () => {
          expect(get(instantiate({ isTma: true, version: versions.min })).isAvailable()).toBe(true);
        });
      });

      describe.runIf(mount)(() => {
        it('should return false if component is not mounted', () => {
          expect(
            get(instantiate({ isTma: true, version: versions.min })).isAvailable(),
          ).toBe(false);
        });

        describe('component is mounted', () => {
          it.runIf(hasMinVersion)(`should return true if version is ${versions.min}`, async () => {
            const component = instantiate({ isTma: true, version: versions.min });
            await mount!(component);
            expect(get(component).isAvailable()).toBe(true);
          });

          it.runIf(!hasMinVersion)('should return true if mini apps env and component is mounted', async () => {
            const component = instantiate({ isTma: true, version: '0.0' });
            await mount!(component);
            expect(get(component).isAvailable()).toBe(true);
          });
        });
      });
    });
  });

  describe('()', () => {
    describe('not mini apps env', () => {
      it('should throw FunctionUnavailableError', () => {
        expect(() => tryCall(instantiate({ isTma: false, version: versions.min }))).toThrow(
          new FunctionUnavailableError(
            'Unable to call function: it can\'t be called outside Mini Apps',
          ),
        );
      });
    });

    describe('mini apps env', () => {
      describe('package uninitialized (version is "0.0")', () => {
        it('should throw FunctionUnavailableError', () => {
          expect(() => tryCall(instantiate({ isTma: true, version: '0.0' })))
            .toThrow(new FunctionUnavailableError(
              'Unable to call function: the SDK was not initialized. Use the SDK init() function',
            ));
        });
      });

      describe('package initialized', () => {
        describe.runIf(hasMinVersion)(() => {
          describe(`minimal version not satisfied (${versions.min})`, () => {
            it('should throw FunctionUnavailableError', () => {
              expect(() => tryCall(instantiate({ isTma: true, version: versions.prev }))).toThrow(
                new FunctionUnavailableError(
                  `Unable to call function: it is unsupported in Mini Apps version ${versions.prev}`,
                ),
              );
            });
          });

          describe.runIf(mount)(`minimal version satisfied (${versions.min})`, () => {
            describe('component is not mounted', () => {
              it('should throw FunctionUnavailableError', () => {
                expect(() => tryCall(instantiate({ isTma: true, version: versions.min }))).toThrow(
                  new FunctionUnavailableError(
                    'Unable to call function: the component is unmounted. Use the mount() method',
                  ),
                );
              });
            });

            describe('component is mounted', () => {
              it('should not throw', async () => {
                const component = instantiate({ isTma: true, version: versions.min });
                await mount!(component);
                expect(() => tryCall(component)).not.toThrow();
              });
            });
          });
        });

        describe.runIf(!hasMinVersion && mount)(() => {
          describe('component is not mounted', () => {
            it('should throw FunctionUnavailableError', () => {
              expect(() => tryCall(instantiate({ isTma: true, version: versions.min }))).toThrow(
                new FunctionUnavailableError(
                  'Unable to call function: the component is unmounted. Use the mount() method',
                ),
              );
            });
          });

          describe('component is mounted', () => {
            it('should not throw', async () => {
              const component = instantiate({ isTma: true, version: versions.min });
              await mount!(component);
              expect(() => tryCall(component)).not.toThrow();
            });
          });
        });
      });
    });
  });
}
