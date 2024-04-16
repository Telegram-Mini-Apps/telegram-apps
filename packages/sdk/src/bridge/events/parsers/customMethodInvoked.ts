import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { CustomMethodInvokedPayload } from '../types/payloads.js';

export function customMethodInvoked(): ValueParser<CustomMethodInvokedPayload, false> {
  return json({
    req_id: string(),
    result: (value) => value,
    error: string().optional(),
  }, 'CustomMethodInvokedPayload');
}
