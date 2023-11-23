import { describe, expect, it } from 'vitest';

import { chatParser } from '~/init-data/index.js';

describe('id', () => {
  it('should throw an error in case, this property is missing', () => {
    expect(
      () => chatParser().parse({
        type: 'group chat',
        title: 'My chat',
      }),
    ).toThrow();
  });

  it('should parse source property as number and pass it to the "id" property', () => {
    expect(
      chatParser().parse({
        id: 882,
        type: 'group chat',
        title: 'My chat',
      }),
    ).toMatchObject({
      id: 882,
    });
  });
});

describe('type', () => {
  it('should throw an error in case, this property is missing', () => {
    expect(
      () => chatParser().parse({
        id: 223,
        title: 'My chat',
      }),
    ).toThrow();
  });

  it('should parse source property as number and pass it to the "type" property', () => {
    expect(
      chatParser().parse({
        id: 882,
        type: 'group chat',
        title: 'My chat',
      }),
    ).toMatchObject({
      type: 'group chat',
    });
  });
});

describe('title', () => {
  it('should throw an error in case, this property is missing', () => {
    expect(
      () => chatParser().parse({
        id: 223,
        type: 'group chat',
      }),
    ).toThrow();
  });

  it('should parse source property as number and pass it to the "title" property', () => {
    expect(
      chatParser().parse({
        id: 882,
        type: 'group chat',
        title: 'My chat',
      }),
    ).toMatchObject({
      title: 'My chat',
    });
  });
});

describe('photo_url', () => {
  it('should parse source property as number and pass it to the "photoUrl" property', () => {
    expect(
      chatParser().parse({
        id: 882,
        type: 'group chat',
        title: 'My chat',
        photo_url: 'https://image.com',
      }),
    ).toMatchObject({
      photoUrl: 'https://image.com',
    });
  });
});

describe('username', () => {
  it('should parse source property as number and pass it to the "username" property', () => {
    expect(
      chatParser().parse({
        id: 882,
        type: 'group chat',
        title: 'My chat',
        username: 'Johny Bravo',
      }),
    ).toMatchObject({
      username: 'Johny Bravo',
    });
  });
});
