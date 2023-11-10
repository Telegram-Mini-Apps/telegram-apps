import { json, number, string } from '@tma.js/parsing';

/**
 * Returns parser used to parse chat data.
 */
export function chat() {
  return json({
    id: number(),
    type: string(),
    title: string(),
    photoUrl: {
      type: string().optional(),
      from: 'photo_url',
    },
    username: string().optional(),
  }, {
    type: 'Chat',
  });
}
