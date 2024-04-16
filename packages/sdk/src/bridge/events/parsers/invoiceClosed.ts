import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { InvoiceClosedPayload } from '../types/payloads.js';

export function invoiceClosed(): ValueParser<InvoiceClosedPayload, false> {
  return json({ slug: string(), status: string() }, 'InvoiceClosedPayload');
}
