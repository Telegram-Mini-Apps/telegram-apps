import { string, looseObject, unknown } from 'valibot';

export const MiniAppsMessage = looseObject({
  eventType: string(),
  eventData: unknown(),
});
