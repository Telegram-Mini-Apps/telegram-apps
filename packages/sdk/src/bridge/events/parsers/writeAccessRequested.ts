import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { WriteAccessRequestedPayload } from '../types/payloads.js';

export function writeAccessRequested(): ValueParser<WriteAccessRequestedPayload, false> {
  return json({ status: string() }, 'WriteAccessRequestedPayload');
}
