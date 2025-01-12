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

    log(false, 'Test');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      '%c09:09:43.007%c / %cSDK',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'Test',
    );
  });

  it('should ignore shouldLog if force is true', () => {
    const [log] = createLogger('SDK', { shouldLog: false });
    const spy = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(spy);

    log(false, 'Test');
    expect(spy).not.toHaveBeenCalled();

    log(true, 'Test');
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

    error(false, 'Test');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      '%c09:09:43.007%c / %cSDK',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'Test',
    );
  });

  it('should ignore shouldLog if force is true', () => {
    const [, error] = createLogger('SDK', { shouldLog: false });
    const spy = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(spy);

    error(false, 'Test');
    expect(spy).not.toHaveBeenCalled();

    error(true, 'Test');
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
