import { boolean } from '@/parsing/parsers/boolean.js';
import { json } from '@/parsing/parsers/json.js';
import { number } from '@/parsing/parsers/number.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { ViewportChangedPayload } from '../types/payloads.js';

export function viewportChanged(): ValueParser<ViewportChangedPayload, false> {
  return json({
    height: number(),
    width: (value) => (
      value === null || value === undefined
        ? window.innerWidth
        : number().parse(value)
    ),
    is_state_stable: boolean(),
    is_expanded: boolean(),
  }, 'ViewportChangedPayload');
}
