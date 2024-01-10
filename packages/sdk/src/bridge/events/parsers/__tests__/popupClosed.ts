import { expect, it } from 'vitest';

import { popupClosed } from '../popupClosed';

it('should return parsed value in case, passed value satisfies schema', () => {
  expect(popupClosed().parse({ button_id: 'ok' })).toStrictEqual({ button_id: 'ok' });
  expect(popupClosed().parse({})).toStrictEqual({});
  expect(popupClosed().parse({ button_id: null })).toStrictEqual({});
  expect(popupClosed().parse({ button_id: 100 })).toStrictEqual({ button_id: '100' });
});
