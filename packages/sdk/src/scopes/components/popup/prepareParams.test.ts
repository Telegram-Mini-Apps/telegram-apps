import { expect, it, describe } from 'vitest';

import { prepareParams } from './prepareParams.js';
import { InvalidArgumentsError } from '@/errors.js';

/**
 * Creates test text.
 * @param length - text length.
 */
function text(length: number): string {
  return new Array(length).fill('a').join('');
}

function createError(message: string) {
  return new InvalidArgumentsError(message);
}

describe('title', () => {
  it('should throw if title length > 64', () => {
    const title = text(65);
    expect(() => prepareParams({ title, message: 'Hey!' }))
      .toThrow(createError(`Invalid title: ${title}`));

    expect(() => prepareParams({ title: text(64), message: 'Hey!' })).not.toThrow();
  });
});

describe('message', () => {
  it('should throw if message length is out of [1, 256]', () => {
    expect(() => prepareParams({ message: '' })).toThrow(createError(`Invalid message: `));

    const message = text(257);
    expect(() => prepareParams({ message }))
      .toThrow(createError(`Invalid message: ${message}`));

    expect(() => prepareParams({ message: text(256) })).not.toThrow();
  });
});

describe('buttons', () => {
  it('should throw if buttons count > 3', () => {
    expect(() => prepareParams({
      message: 'a',
      buttons: new Array(4),
    })).toThrow(createError(`Invalid buttons count: 4`));

    expect(() => prepareParams({
      message: 'a',
      buttons: new Array(3),
    })).not.toThrow();
  });

  it('should append button type "close" if buttons array is empty', () => {
    expect(prepareParams({ message: 'a' }).buttons).toStrictEqual([{ type: 'close', id: '' }]);
  });

  describe('button', () => {
    it('should throw if id length > 64', () => {
      const id = text(65);
      expect(() => prepareParams({
        message: 'A',
        buttons: [
          { type: 'ok', id: text(1) },
          { type: 'ok', id },
        ],
      }))
        .toThrow(createError(`Button with index 1 has invalid id: ${id}`));

      expect(() => prepareParams({
        message: 'A',
        buttons: [
          { type: 'ok', id: text(1) },
          { type: 'ok', id: text(64) },
        ],
      })).not.toThrow();
    });

    it.each([
      undefined,
      'default',
      'destructive',
    ] as const)('should throw if text length is out of [0, 64] and button type is %s', (type) => {
      const invalidText = text(65);
      expect(() => prepareParams({
        message: 'A',
        buttons: [{ type, text: invalidText }],
      })).toThrowError(createError(`Button with index 0 has invalid text: ${invalidText}`));

      expect(() => prepareParams({
        message: 'A',
        buttons: [{ type, text: text(64) }],
      })).not.toThrow();
    });
  });
});

it('should fulfill all optional popup parameters', () => {
  expect(prepareParams({
    message: 'Message',
    buttons: [{ type: 'default', text: 'Wow!' }, { type: 'close' }],
  }))
    .toStrictEqual({
      title: '',
      message: 'Message',
      buttons: [{ id: '', type: 'default', text: 'Wow!' }, { type: 'close', id: '' }],
    });
});
