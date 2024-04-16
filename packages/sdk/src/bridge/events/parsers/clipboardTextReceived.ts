import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { ClipboardTextReceivedPayload } from '../types/payloads.js';

export function clipboardTextReceived(): ValueParser<ClipboardTextReceivedPayload, false> {
  return json({
    req_id: string(),
    data: (value) => (
      value === null ? value : string().optional().parse(value)
    ),
  }, 'ClipboardTextReceivedPayload');
}
