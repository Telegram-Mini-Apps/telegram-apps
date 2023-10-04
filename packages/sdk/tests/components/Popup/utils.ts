import { describe, expect, it } from 'vitest';

import { preparePopupParams } from '../../../src/components/Popup/utils.js';

/**
 * Creates test text.
 * @param length - text length.
 */
function createText(length: number): string {
  return new Array(length).fill('a').join('');
}

describe('components', () => {
  describe('Popup', () => {
    describe('utils', () => {
      describe('preparePopupParams', () => {
        it('should throw an error in case, title length is more than 64 symbols', () => {
          expect(() => preparePopupParams({
            title: createText(65),
            message: 'Hey!',
          })).toThrow(/^Title has incorrect size/);

          expect(() => preparePopupParams({
            title: createText(64),
            message: 'Hey!',
          })).not.toThrow();
        });

        it('should throw an error in case, message length is zero or more than 256 symbols', () => {
          expect(() => preparePopupParams({
            message: '',
          })).toThrow(/^Message has incorrect size/);

          expect(() => preparePopupParams({
            message: createText(257),
          })).toThrow(/^Message has incorrect size/);

          expect(() => preparePopupParams({
            message: createText(256),
          })).not.toThrow();
        });

        it('should throw an error in case, buttons count is more than 3', () => {
          expect(() => preparePopupParams({
            message: 'a',
            buttons: new Array(4).fill({ type: 'close' }),
          })).toThrow(/^Buttons have incorrect size/);

          expect(() => preparePopupParams({
            message: 'a',
            buttons: new Array(3).fill({ type: 'close' }),
          })).not.toThrow();
        });

        it('should append button type "close" in case, buttons array is empty', () => {
          expect(preparePopupParams({ message: 'a' }).buttons).toStrictEqual([{
            type: 'close',
            id: '',
          }]);
        });

        it('should throw an error in case, some button text length size is zero or more than 64 symbols', () => {
          expect(() => preparePopupParams({
            message: 'A',
            buttons: [{ type: 'default', text: createText(65) }],
          })).toThrowError(/^Button text with type/);

          expect(() => preparePopupParams({
            message: 'A',
            buttons: [{ type: 'default', text: '' }],
          })).toThrowError(/^Button text with type/);

          expect(() => preparePopupParams({
            message: 'A',
            buttons: [{ type: 'default', text: createText(64) }],
          })).not.toThrow();
        });

        it('should fulfill all optional popup parameters', () => {
          expect(preparePopupParams({
            message: 'Message',
            buttons: [{ type: 'default', text: 'Wow!' }, { type: 'close' }],
          }))
            .toStrictEqual({
              title: '',
              message: 'Message',
              buttons: [{ id: '', type: 'default', text: 'Wow!' }, { type: 'close', id: '' }],
            });
        });
      });
    });
  });
});
