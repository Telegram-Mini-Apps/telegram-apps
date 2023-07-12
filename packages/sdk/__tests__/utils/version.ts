import { createSupportsFunc } from '../../src/utils';

describe('utils', () => {
  describe('version.ts', () => {
    describe('createSupportsFunc', () => {
      describe('returned function', () => {
        it('should return true in case, passed method is supported '
          + 'by specified Web Apps version. False otherwise', () => {
          const supports = createSupportsFunc('6.0', {
            openPopup: 'web_app_open_popup',
            closeApp: 'web_app_close',
          });
          // "web_app_open_popup" is supported starting from 6.2.
          expect(supports('openPopup')).toBe(false);
          // "web_app_close" is always supported.
          expect(supports('closeApp')).toBe(true);
        });
      });
    });
  });
});
