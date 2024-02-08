import { json, string } from '~/parsing/index.js';

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

const parser = json<MiniAppsMessage>({
  eventType: string(),
  eventData: (value) => value,
});

/**
 * Parses value as a message between client and Telegram applications.
 * @param value - value to parse.
 */
export function parseMessage(value: unknown): MiniAppsMessage {
  return parser.parse(value);
}
