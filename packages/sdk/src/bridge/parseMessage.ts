import { json } from '@/parsing/parsers/json.js';
import { string } from '@/parsing/parsers/string.js';

/**
 * Message format used in communication between client and Telegram applications.
 */
export interface MiniAppsMessage {
  /**
   * Event name.
   */
  eventType: string;
  /**
   * Event parameters.
   */
  eventData?: unknown;
}

/**
 * Parses value as a message between client and Telegram applications.
 * @param value - value to parse.
 */
export function parseMessage(value: unknown): MiniAppsMessage {
  return json({
    eventType: string(),
    eventData: (v) => v,
  }, 'MiniAppsMessage').parse(value);
}
