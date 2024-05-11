import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Logger } from './Logger.js';

const now = new Date('2022-11-04T09:09:43.007Z');

beforeAll(() => {
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('error', () => {
  it('should call console.error()', () => {
    const logger = new Logger('SDK');
    const spy = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(spy);

    logger.error('Test');
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

describe('log', () => {
  it('should call console.log()', () => {
    const logger = new Logger('SDK');
    const spy = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(spy);

    logger.log('Test');
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
