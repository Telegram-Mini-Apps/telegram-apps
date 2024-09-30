/**
 * Known type of chat.
 */
export type ChatType =
  | 'sender'
  | 'private'
  | 'group'
  | 'supergroup'
  | 'channel'
  | string;

/**
 * Describes Telegram Mini Apps [User](https://docs.telegram-mini-apps.com/platform/init-data#user) type.
 */
export interface User {
  /**
   * True, if this user added the bot to the attachment menu.
   */
  addedToAttachmentMenu?: boolean;
  /**
   * True, if this user allowed the bot to message them.
   */
  allowsWriteToPm?: boolean;
  /**
   * First name of the user or bot.
   */
  firstName: string;
  /**
   * A unique identifier for the user or bot.
   */
  id: number;
  /**
   * True, if this user is a bot. Returned in the `receiver` field only.
   * @see InitData.receiver
   */
  isBot?: boolean;
  /**
   * True, if this user is a Telegram Premium user.
   */
  isPremium?: boolean;
  /**
   * Last name of the user or bot.
   */
  lastName?: string;
  /**
   * [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the user's language.
   * Returns in user field only.
   */
  languageCode?: string;
  /**
   * URL of the user’s profile photo. The photo can be in .jpeg or .svg
   * formats. Only returned for Mini Apps launched from the attachment menu.
   */
  photoUrl?: string;
  /**
   * Username of the user or bot.
   */
  username?: string;
}

/**
 * Describes Telegram Mini Apps [Chat](https://docs.telegram-mini-apps.com/platform/init-data#chat) type.
 */
export interface Chat {
  /**
   * Unique identifier for this chat.
   */
  id: number;
  /**
   * URL of the chat’s photo. The photo can be in .jpeg or .svg formats.
   * Only returned for Mini Apps launched from the attachment menu.
   */
  photoUrl?: string;
  /**
   * Type of the chat.
   */
  type: 'group' | 'supergroup' | 'channel' | string;
  /**
   * Title of the chat.
   */
  title: string;
  /**
   * Username of the chat.
   */
  username?: string;
}

/**
 * Describes Telegram Mini Apps [InitData](https://docs.telegram-mini-apps.com/platform/init-data#parameters-list)
 * type.
 */
export interface InitData {
  /**
   * Init data generation date.
   */
  authDate: Date;
  /**
   * The number of seconds after which a message can be sent via the method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery).
   */
  canSendAfter?: number;
  /**
   * An object containing data about the chat where the bot was launched via
   * the attachment menu. Returned for supergroups, channels and group
   * chats – only for Mini Apps launched via the attachment menu.
   */
  chat?: Chat;
  /**
   * The type of chat from which Mini App was opened.
   */
  chatType?: ChatType;
  /**
   * A global identifier indicating the chat from which Mini App was opened. Returned only for
   * applications opened by direct link.
   */
  chatInstance?: string;
  /**
   * A hash of all passed parameters, which the bot server can use to
   * check their [validity](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app).
   */
  hash: string;
  /**
   * A unique identifier for the Mini App session, required for sending
   * messages via the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
   */
  queryId?: string;
  /**
   * An object containing data about the chat partner of the current user in
   * the chat where the bot was launched via the attachment menu.
   * Returned only for private chats and only for Mini Apps launched
   * via the attachment menu.
   */
  receiver?: User;
  /**
   * The value of the `startattach` or `startapp` parameter, passed via link.
   */
  startParam?: string;
  /**
   * An object containing data about the current user.
   */
  user?: User;
}
