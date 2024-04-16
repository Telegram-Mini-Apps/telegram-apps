import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { PhoneRequestedPayload } from '../types/payloads.js';

export function phoneRequested(): ValueParser<PhoneRequestedPayload, false> {
  return json({ status: string() }, 'PhoneRequestedPayload');
}
