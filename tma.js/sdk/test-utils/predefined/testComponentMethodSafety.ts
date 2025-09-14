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
  instantiate: (opts: {
    isTma: boolean;
    version: string;
  }) => C;
  /**
   * Minimal version for the method to be supported.
   */
  minVersion: string;
  /**
   * Mounts the component.
   */
  mount?: (component: C) => void;
  /**
   * Attempts to call component method.
   * @param component
   */
  try: (component: C) => any;
}) {
  const [a, b = 0] = minVersion.split('.').map(Number);
  const prevVersion = `${b === 0 ? a - 1 : a}.${b === 0 ? 99 : b - 1}`;

  describe('isSupported', () => {
    testIsSupported(
      version => get(instantiate({ isTma: true, version })),
      minVersion,
    );
  });

  describe('isAvailable', () => {
    it('should return false if not mini apps env', () => {
      expect(get(instantiate({ isTma: false, version: minVersion })).isAvailable()).toBe(false);
    });

    it('should return false if version is "0.0" (SDK not initialized)', () => {
      expect(get(instantiate({ isTma: true, version: '0.0' })).isAvailable()).toBe(false);
    });

    it(`should return false if version is less than ${minVersion}`, () => {
      expect(get(instantiate({ isTma: true, version: prevVersion })).isAvailable()).toBe(false);
    });

    if (mount) {
      it('should return false if component is not mounted', () => {
        expect(get(instantiate({ isTma: true, version: minVersion })).isAvailable()).toBe(false);
      });

      it(
        `should return true if mini apps env, version is ${minVersion} and component is mounted`,
        () => {
          const component = instantiate({ isTma: true, version: minVersion });
          mount(component);
          expect(get(component).isAvailable()).toBe(true);
        },
      );
    } else {
      it(`should return true if mini apps env and version is ${minVersion}`, () => {
        expect(get(instantiate({ isTma: true, version: minVersion })).isAvailable()).toBe(true);
      });
    }
  });

  describe('not mini apps env', () => {
    it('should throw FunctionUnavailableError', () => {
      expect(() => tryCall(instantiate({ isTma: false, version: minVersion }))).toThrow(
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
      describe(`minimal version not satisfied (${minVersion})`, () => {
        it('should throw FunctionUnavailableError', () => {
          expect(() => tryCall(instantiate({ isTma: true, version: prevVersion }))).toThrow(
            new FunctionUnavailableError(
              `Unable to call function: it is unsupported in Mini Apps version ${prevVersion}`,
            ),
          );
        });
      });

      if (mount) {
        describe(`minimal version satisfied (${minVersion})`, () => {
          describe('component is not mounted', () => {
            it('should throw FunctionUnavailableError', () => {
              expect(() => tryCall(instantiate({ isTma: true, version: minVersion }))).toThrow(
                new FunctionUnavailableError(
                  'Unable to call function: the component is unmounted. Use the mount() method',
                ),
              );
            });
          });

          describe('component is mounted', () => {
            it('should not throw', () => {
              const component = instantiate({ isTma: true, version: minVersion });
              mount(component);
              expect(() => tryCall(component)).not.toThrow();
            });
          });
        });
      }
    });
  });
}