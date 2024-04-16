import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { QrTextReceivedPayload } from '../types/payloads.js';

export function qrTextReceived(): ValueParser<QrTextReceivedPayload, false> {
  return json({ data: string().optional() }, 'QrTextReceivedPayload');
}
