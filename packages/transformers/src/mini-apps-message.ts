import { optional, string, looseObject } from 'valibot';

export const MiniAppsMessage = looseObject({
  eventType: string(),
  eventData: optional(string()),
});
