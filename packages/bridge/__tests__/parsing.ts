import {
  parseClipboardTextReceivedPayload,
  parseInvoiceClosedPayload,
  parsePopupClosedPayload, parseQrTextReceivedPayload,
  parseThemeChangedPayload,
  parseViewportChangedPayload,
} from '../src/parsing';

describe('parsing.ts', () => {
  describe('parseThemeChangedPayload', () => {
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
        expect(parseThemeChangedPayload(value)).toStrictEqual(value);
        expect(parseThemeChangedPayload(JSON.stringify(value))).toStrictEqual(value);
      });
    });

    it('should throw an error in case, passed value does not satisfy schema', () => {
      expect(() => parseThemeChangedPayload({})).toThrow();
    });
  });

  describe('parseViewportChangedPayload', () => {
    const windowSpy = jest.spyOn(window, 'window', 'get');
    const innerWidth = 2000;

    beforeEach(() => {
      windowSpy.mockImplementation(() => ({ innerWidth }) as any);
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
        const width = value.width === undefined || value.width === null
          ? innerWidth : value.width;
        expect(parseViewportChangedPayload(value))
          .toStrictEqual({ ...value, width });
        expect(parseViewportChangedPayload(JSON.stringify(value)))
          .toStrictEqual({ ...value, width });
      });
    });

    it('should throw an error in case, passed value does not satisfy schema', () => {
      expect(() => parseViewportChangedPayload({})).toThrow();
    });
  });

  describe('parsePopupClosedPayload', () => {
    it('should return parsed value in case, passed value satisfies schema', () => {
      expect(parsePopupClosedPayload({ button_id: 'ok' })).toStrictEqual({ button_id: 'ok' });
      expect(parsePopupClosedPayload({})).toStrictEqual({});
      expect(parsePopupClosedPayload({ button_id: null })).toStrictEqual({});
    });

    it('should throw an error in case, passed value does not satisfy schema', () => {
      expect(() => parsePopupClosedPayload({ button_id: 100 })).toThrow();
    });
  });

  describe('parseQrTextReceivedPayload', () => {
    it('should return parsed value in case, passed value satisfies schema', () => {
      expect(parseQrTextReceivedPayload({ data: 'ok' })).toStrictEqual({ data: 'ok' });
      expect(parseQrTextReceivedPayload({})).toStrictEqual({});
    });

    it('should throw an error in case, passed value does not satisfy schema', () => {
      expect(() => parseQrTextReceivedPayload({ data: 100 })).toThrow();
    });
  });

  describe('parseInvoiceClosedPayload', () => {
    it('should return parsed value in case, passed value satisfies schema', () => {
      const value = { slug: 'abc', status: 'def' };
      expect(parseInvoiceClosedPayload(value)).toStrictEqual(value);
    });

    it('should throw an error in case, passed value does not satisfy schema', () => {
      expect(() => parseInvoiceClosedPayload({})).toThrow();
    });
  });

  describe('parseClipboardTextReceivedPayload', () => {
    it('should return parsed value in case, passed value satisfies schema', () => {
      const cases = [
        { req_id: 'abc', data: 'ok' },
        { req_id: 'abc' },
        { req_id: 'abc', data: null },
      ];
      cases.forEach((value) => {
        expect(parseClipboardTextReceivedPayload(value)).toStrictEqual(value);
        expect(parseClipboardTextReceivedPayload(JSON.stringify(value)))
          .toStrictEqual(value);
      });
    });

    it('should throw an error in case, passed value does not satisfy schema', () => {
      expect(() => parseClipboardTextReceivedPayload({})).toThrow();
    });
  });
});
