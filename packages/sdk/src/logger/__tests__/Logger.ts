import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Logger } from '../Logger';

const now = new Date('2022-11-04T09:09:43.007Z');

afterEach(() => {
  vi.resetAllMocks();
});

beforeAll(() => {
  vi.useFakeTimers().setSystemTime(now);
});

afterAll(() => {
  vi.useRealTimers();
});

it('should not call console methods if logger is disabled', () => {
  const logger = new Logger('', false);
  const spy = vi.fn();

  vi.spyOn(console, 'log').mockImplementation(spy);
  vi.spyOn(console, 'warn').mockImplementation(spy);
  vi.spyOn(console, 'error').mockImplementation(spy);

  logger.log();
  logger.warn();
  logger.error();
  expect(spy).not.toHaveBeenCalled();
});

describe('enable', () => {
  it('should start logging messages into console', () => {
    const logger = new Logger('', false);
    const spy = vi.fn();

    vi.spyOn(console, 'log').mockImplementation(spy);
    logger.log();
    expect(spy).not.toHaveBeenCalled();

    logger.enable();
    logger.log();
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('disable', () => {
  it('should stop logging messages into console', () => {
    const logger = new Logger('', true);
    const spy = vi.fn();

    vi.spyOn(console, 'log').mockImplementation(spy);
    logger.log();
    expect(spy).toHaveBeenCalledOnce();

    spy.mockReset();

    logger.disable();
    logger.log();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('error', () => {
  it('should call console.error()', () => {
    const logger = new Logger('My prefix', true);
    const spy = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(spy);

    logger.error('Test');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('[09:09:43.007]', 'My prefix', 'Test');
  });
});

describe('log', () => {
  it('should call console.log()', () => {
    const logger = new Logger('My prefix', true);
    const spy = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(spy);

    logger.log('Test');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('[09:09:43.007]', 'My prefix', 'Test');
  });
});

describe('warn', () => {
  it('should call console.warn()', () => {
    const logger = new Logger('My prefix', true);
    const spy = vi.fn();
    vi.spyOn(console, 'warn').mockImplementation(spy);

    logger.warn('Test');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('[09:09:43.007]', 'My prefix', 'Test');
  });
});
