import {
  clipboardTextReceivedPayload,
  invoiceClosedPayload,
  popupClosedPayload, qrTextReceivedPayload,
  themeChangedPayload,
  viewportChangedPayload,
} from '../../src/events/parsing.js';

describe('events', () => {
  describe('parsing.ts', () => {
    describe('themeChangedPayload', () => {
      it('should return parsed value in case, passed value satisfies schema', () => {
        const values = [
          {
            theme_params: {
              bg_color: '#ffaabb',
              text_color: '#bbaadd',
              hint_color: '#113322',
              link_color: '#882133',
              button_color: '#faaafa',
              button_text_color: '#666271',
              secondary_bg_color: '#2231aa',
            },
          },
          {
            theme_params: {
              bg_color: '#ffaabb',
              text_color: '#bbaadd',
              hint_color: '#113322',
              link_color: '#882133',
              button_color: '#faaafa',
              button_text_color: '#666271',
            },
          },
        ];

        values.forEach((value) => {
          expect(themeChangedPayload.parse(value)).toStrictEqual(value);
          expect(themeChangedPayload.parse(JSON.stringify(value))).toStrictEqual(value);
        });
      });

      it('should throw an error in case, passed value does not satisfy schema', () => {
        expect(() => themeChangedPayload.parse({})).toThrow();
        expect(() => themeChangedPayload.parse({
          theme_params: {
            bg_color: 'Hello there!',
          },
        })).toThrow();
      });
    });

    describe('viewportChangedPayload', () => {
      const windowSpy = jest.spyOn(window, 'window', 'get');
      // const innerWidth = 2000;

      beforeEach(() => {
        windowSpy.mockImplementation(() => ({ innerWidth: 2000 }) as any);
      });

      afterEach(() => {
        windowSpy.mockRestore();
      });

      it('should return parsed value in case, passed value satisfies schema', () => {
        const values = [
          {
            height: 900,
            is_state_stable: true,
            is_expanded: true,
          },
          {
            width: null,
            height: 900,
            is_state_stable: true,
            is_expanded: true,
          },
          {
            height: 900,
            width: 100,
            is_state_stable: true,
            is_expanded: true,
          },
        ];

        values.forEach((value) => {
          const width = !value.width ? window.innerWidth : value.width;
          expect(viewportChangedPayload.parse(value)).toStrictEqual({ ...value, width });
          expect(viewportChangedPayload.parse(JSON.stringify(value))).toStrictEqual({
            ...value,
            width,
          });
        });
      });

      it('should throw an error in case, passed value does not satisfy schema', () => {
        expect(() => viewportChangedPayload.parse({})).toThrow();
      });
    });

    describe('popupClosedPayload', () => {
      it('should return parsed value in case, passed value satisfies schema', () => {
        expect(popupClosedPayload.parse({ button_id: 'ok' })).toStrictEqual({ button_id: 'ok' });
        expect(popupClosedPayload.parse({})).toStrictEqual({});
        expect(popupClosedPayload.parse({ button_id: null })).toStrictEqual({});
      });

      it('should throw an error in case, passed value does not satisfy schema', () => {
        expect(() => popupClosedPayload.parse({ button_id: 100 })).toThrow();
      });
    });

    describe('qrTextReceivedPayload', () => {
      it('should return parsed value in case, passed value satisfies schema', () => {
        expect(qrTextReceivedPayload.parse({ data: 'ok' })).toStrictEqual({ data: 'ok' });
        expect(qrTextReceivedPayload.parse({})).toStrictEqual({});
      });

      it('should throw an error in case, passed value does not satisfy schema', () => {
        expect(() => qrTextReceivedPayload.parse({ data: 100 })).toThrow();
      });
    });

    describe('invoiceClosedPayload', () => {
      it('should return parsed value in case, passed value satisfies schema', () => {
        const value = { slug: 'abc', status: 'def' };
        expect(invoiceClosedPayload.parse(value)).toStrictEqual(value);
      });

      it('should throw an error in case, passed value does not satisfy schema', () => {
        expect(() => invoiceClosedPayload.parse({})).toThrow();
      });
    });

    describe('clipboardTextReceivedPayload', () => {
      it('should return parsed value in case, passed value satisfies schema', () => {
        const cases = [
          { req_id: 'abc', data: 'ok' },
          { req_id: 'abc' },
          { req_id: 'abc', data: null },
        ];
        cases.forEach((value) => {
          expect(clipboardTextReceivedPayload.parse(value)).toStrictEqual(value);
          expect(clipboardTextReceivedPayload.parse(JSON.stringify(value)))
            .toStrictEqual(value);
        });
      });

      it('should throw an error in case, passed value does not satisfy schema', () => {
        expect(() => clipboardTextReceivedPayload.parse({})).toThrow();
      });
    });
  });
});
