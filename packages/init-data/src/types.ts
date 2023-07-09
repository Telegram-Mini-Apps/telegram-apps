/**
 * Describes user information.
 * @see https://core.telegram.org/bots/webapps#webappuser
 */
export interface User {
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
   * IETF language tag of the user's language. Returns in user field only.
   * TODO: Specify expected values.
   * @see https://en.wikipedia.org/wiki/IETF_language_tag
   */
  languageCode?: string;

  /**
   * URL of the user’s profile photo. The photo can be in .jpeg or .svg
   * formats. Only returned for Web Apps launched from the attachment menu.
   */
  photoUrl?: string;

  /**
   * Username of the user or bot.
   */
  username?: string;
}

/**
 * Describes chat information.
 * @see https://core.telegram.org/bots/webapps#webappchat
 */
export interface Chat {
  /**
   * Unique identifier for this chat.
   */
  id: number;

  /**
   * URL of the chat’s photo. The photo can be in .jpeg or .svg formats.
   * Only returned for Web Apps launched from the attachment menu.
   */
  photoUrl?: string;

  /**
   * Type of chat.
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
 * Describes parsed initial data sent from Web App.
 * @see https://core.telegram.org/bots/webapps#webappinitdata
 */
export interface InitData {
  /**
   * Init data generation date.
   */
  authDate: Date;

  /**
   * Date after which a message can be sent via the answerWebAppQuery method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  canSendAfter?: Date;

  /**
   * An object containing data about the chat where the bot was launched via
   * the attachment menu. Returned for supergroups, channels and group
   * chats – only for Web Apps launched via the attachment menu.
   */
  chat?: Chat;

  /**
   * A hash of all passed parameters, which the bot server can use to
   * check their validity.
   *
   * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
   */
  hash: string;

  /**
   * A unique identifier for the Web App session, required for sending
   * messages via the answerWebAppQuery method.
   *
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  queryId?: string;

  /**
   * An object containing data about the chat partner of the current user in
   * the chat where the bot was launched via the attachment menu.
   * Returned only for private chats and only for Web Apps launched
   * via the attachment menu.
   */
  receiver?: User;

  /**
   * The value of the startattach parameter, passed via link. Only returned for
   * Web Apps when launched from the attachment menu via link.
   */
  startParam?: string;

  /**
   * An object containing data about the current user.
   */
  user?: User;
}
