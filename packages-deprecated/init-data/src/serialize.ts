import type { InitData, User } from './types.js';

function setString(params: URLSearchParams, key: string, value: string | undefined) {
  if (value === undefined) {
    return;
  }
  params.set(key, value);
}

function setUser(params: URLSearchParams, key: string, value: User | undefined) {
  if (value === undefined) {
    return;
  }
  const {
    photoUrl,
    firstName,
    lastName,
    isPremium,
    languageCode,
    isBot,
    ...rest
  } = value;

  params.set(key, JSON.stringify({
    ...rest,
    photo_url: photoUrl,
    first_name: firstName,
    last_name: lastName,
    is_premium: isPremium,
    language_code: languageCode,
    is_bot: isBot,
  }));
}

/**
 * Converts init data to its initial representation.
 * @param value - init data.
 */
export function serialize(value: InitData): string {
  const {
    authDate,
    canSendAfter,
    chat,
    chatInstance,
    chatType,
    hash,
    queryId,
    receiver,
    startParam,
    user,
  } = value;

  const params = new URLSearchParams();

  params.set('auth_date', (authDate.getTime() / 1000).toString());
  setString(params, 'chat_instance', chatInstance);
  setString(params, 'chat_type', chatType);
  setString(params, 'hash', hash);
  setString(params, 'query_id', queryId);
  setUser(params, 'receiver', receiver);
  setString(params, 'start_param', startParam);
  setUser(params, 'user', user);

  if (chat) {
    const { photoUrl, ...rest } = chat;
    params.set('chat', JSON.stringify({
      ...rest,
      photo_url: photoUrl,
    }));
  }

  if (canSendAfter) {
    params.set('can_send_after', canSendAfter.toString());
  }

  return params.toString();
}
