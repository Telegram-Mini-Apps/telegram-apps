import { describe, expect, it } from 'vitest';

import { FunctionUnavailableError } from '@/errors.js';

import { testIsSupported } from './testIsSupported.js';

export function testComponentMethodSafety<C>({
  instantiate,
  try: tryCall,
  get,
  minVersion,
  mount,
}: {
  /**
   * Retrieves component method.
   * @param component
   */
  get: (component: C) => {
    isSupported: () => boolean;
    isAvailable: () => boolean;
  };
  /**
   * Creates a new component instance.
   * @param opts
   */
  instantiate: (opts: { isTma: boolean; version: string }) => C;
  /**
   * Minimal version for the method to be supported.
   */
  minVersion?: string;
  /**
   * Mounts the component.
   */
  mount?: (component: C) => void | Promise<void>;
  /**
   * Attempts to call component method.
   * @param component
   */
  try: (component: C) => any;
}) {
  const hasMinVersion = !!minVersion;
  const versions: { prev: string; min: string } | undefined = minVersion
    ? (() => {
      const [a, b = 0] = minVersion.split('.').map(Number);
      return {
        prev: `${b === 0 ? a - 1 : a}.${b === 0 ? 99 : b - 1}`,
        min: minVersion,
      };
    })()
    : { prev: '99.9', min: '100' };

  if (hasMinVersion) {
    describe('isSupported', () => {
      testIsSupported(version => get(instantiate({ isTma: true, version })), versions.min);
    });
  }

  describe('isAvailable', () => {
    it('should return false if not mini apps env', () => {
      expect(get(instantiate({ isTma: false, version: versions.min })).isAvailable()).toBe(false);
    });

    if (hasMinVersion) {
      it('should return false if version is "0.0" (SDK not initialized)', () => {
        expect(get(instantiate({ isTma: true, version: '0.0' })).isAvailable()).toBe(false);
      });

      it(`should return false if version is less than ${versions.min}`, () => {
        expect(get(instantiate({ isTma: true, version: versions.prev })).isAvailable()).toBe(false);
      });
    }

    if (!mount) {
      if (hasMinVersion) {
        it(`should return true if mini apps env and version is ${versions.min}`, () => {
          expect(get(instantiate({ isTma: true, version: versions.min })).isAvailable()).toBe(true);
        });
      }
      return;
    }

    it('should return false if component is not mounted', () => {
      expect(get(instantiate({ isTma: true, version: versions.min })).isAvailable()).toBe(false);
    });

    if (hasMinVersion) {
      it(
        `should return true if mini apps env, version is ${versions.min} and component is mounted`,
        async () => {
          const component = instantiate({ isTma: true, version: versions.min });
          await mount(component);
          expect(get(component).isAvailable()).toBe(true);
        },
      );
    } else {
      it('should return true if mini apps env and component is mounted', async () => {
        const component = instantiate({ isTma: true, version: versions.min });
        await mount(component);
        expect(get(component).isAvailable()).toBe(true);
      });
    }
  });

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
    if (hasMinVersion) {
      describe('package uninitialized (version is "0.0")', () => {
        it('should throw FunctionUnavailableError', () => {
          expect(() => tryCall(instantiate({ isTma: true, version: '0.0' })))
            .toThrow(new FunctionUnavailableError(
              'Unable to call function: the SDK was not initialized. Use the SDK init() function',
            ));
        });
      });
    }

    describe('package initialized', () => {
      if (hasMinVersion) {
        describe(`minimal version not satisfied (${versions.min})`, () => {
          it('should throw FunctionUnavailableError', () => {
            expect(() => tryCall(instantiate({ isTma: true, version: versions.prev }))).toThrow(
              new FunctionUnavailableError(
                `Unable to call function: it is unsupported in Mini Apps version ${versions.prev}`,
              ),
            );
          });
        });

        if (mount) {
          describe(`minimal version satisfied (${versions.min})`, () => {
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
                await mount(component);
                expect(() => tryCall(component)).not.toThrow();
              });
            });
          });
        }
        return;
      }

      if (!mount) {
        return;
      }

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
          await mount(component);
          expect(() => tryCall(component)).not.toThrow();
        });
      });
    });
  });
}