import { describe, expect, it } from 'vitest';

import { userParser } from '../userParser';

describe('first_name', () => {
  it('should throw an error in case, this property is missing', () => {
    expect(() => userParser().parse({ id: 123 })).toThrow();
  });

  it('should parse source property as string and pass it to the "firstName" property', () => {
    expect(
      userParser().parse({ id: 123, first_name: 'Pavel' }),
    ).toMatchObject({
      firstName: 'Pavel',
    });
  });
});

describe('id', () => {
  it('should throw an error in case, this property is missing', () => {
    expect(() => userParser().parse({ first_name: 'Pavel' })).toThrow();
  });

  it('should parse source property as number and pass it to the "id" property', () => {
    expect(
      userParser().parse({
        id: 123,
        first_name: 'Pavel',
      }),
    ).toMatchObject({
      id: 123,
    });
  });
});

// Check optional booleans.
[
  ['added_to_attachment_menu', 'addedToAttachmentMenu'],
  ['allows_write_to_pm', 'allowsWriteToPm'],
  ['is_bot', 'isBot'],
  ['is_premium', 'isPremium'],
].forEach(([from, to]) => {
  describe(from, () => {
    it(`should parse source property as boolean and pass it to the "${to}" property`, () => {
      expect(
        userParser().parse({
          id: 123,
          first_name: 'Pavel',
          [from]: false,
        }),
      ).toMatchObject({
        [to]: false,
      });

      expect(
        () => userParser().parse({
          id: 123,
          first_name: 'Pavel',
          [from]: 'non-boolean',
        }),
      ).toThrow();
    });
  });
});

// Check optional strings.
[
  ['language_code', 'languageCode'],
  ['last_name', 'lastName'],
  ['photo_url', 'photoUrl'],
  ['username', 'username'],
].forEach(([from, to]) => {
  describe(from, () => {
    it(`should parse source property as string and pass it to the "${to}" property`, () => {
      expect(
        userParser().parse({
          id: 123,
          first_name: 'Pavel',
          [from]: 'my custom property',
        }),
      ).toMatchObject({
        [to]: 'my custom property',
      });

      expect(
        () => userParser().parse({
          id: 123,
          first_name: 'Pavel',
          [from]: {
            key: 'cant parse it',
          },
        }),
      ).toThrow();
    });
  });
});
