import { object } from '@/transformers/object.js';
import { string } from '@/transformers/string.js';

export interface MiniAppsMessage {
  eventType: string;
  eventData?: unknown;
}

export const miniAppsMessage = object<MiniAppsMessage>({
  eventType: string(),
  eventData: v => v,
}, 'miniAppsMessage');
