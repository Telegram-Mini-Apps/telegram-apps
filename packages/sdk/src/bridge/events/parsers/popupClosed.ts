import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { PopupClosedPayload } from '../types/payloads.js';

export function popupClosed(): ValueParser<PopupClosedPayload, false> {
  return json({
    button_id: (value) => (
      value === null || value === undefined ? undefined : string().parse(value)
    ),
  }, 'PopupClosedPayload');
}
