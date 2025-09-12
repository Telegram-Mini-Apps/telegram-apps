import { string, looseObject, unknown, optional } from 'valibot';

export const MiniAppsMessageSchema = looseObject({
  eventType: string(),
  eventData: optional(unknown()),
});
