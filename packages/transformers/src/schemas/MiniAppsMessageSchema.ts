import { string, looseObject, unknown } from 'valibot';

export const MiniAppsMessageSchema = looseObject({
  eventType: string(),
  eventData: unknown(),
});
