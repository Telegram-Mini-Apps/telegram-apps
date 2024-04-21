import { expect, it, vi } from 'vitest';

import { emitMiniAppsEvent } from './emitMiniAppsEvent.js';

it('should call window.dispatchEvent with the Message event containing properties "data" property equal to { eventType, eventData } stringified and "source" property equal to window.parent', () => {
  const dispatch = vi.spyOn(window, 'dispatchEvent').mockImplementationOnce(() => null as any);
  vi.spyOn(window, 'parent', 'get').mockImplementationOnce(() => 'PARENT' as any);
  emitMiniAppsEvent('test', 'some-data');
  expect(dispatch).toHaveBeenCalledOnce();

  expect(dispatch.mock.calls[0][0]).toBeInstanceOf(MessageEvent);
  expect(dispatch.mock.calls[0][0]).toMatchObject({
    type: 'message',
    data: '{"eventType":"test","eventData":"some-data"}',
    source: 'PARENT' as any,
  });
});
