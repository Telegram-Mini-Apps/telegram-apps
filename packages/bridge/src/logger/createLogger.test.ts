import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createLogger } from './createLogger.js';

const now = new Date('2022-11-04T09:09:43.007Z');

beforeAll(() => {
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('log', () => {
  it('should call console.log()', () => {
    const [log] = createLogger('SDK');
    const spy = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(spy);

    log('Test');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      '%c09:09:43.007%c / %cSDK',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'Test',
    );
  });
});

describe('error', () => {
  it('should call console.error()', () => {
    const [, error] = createLogger('SDK');
    const spy = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(spy);

    error('Test');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      '%c09:09:43.007%c / %cSDK',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'Test',
    );
  });
});
