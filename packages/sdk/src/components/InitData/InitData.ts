import type { HasUndefined, If } from '@tma.js/util-types';
import type {
  Chat,
  InitData as InitDataType,
  User,
} from '@tma.js/init-data';

import { State } from '../../state/index.js';

type InitDataState = {
  [K in keyof InitDataType]-?: If<
    HasUndefined<InitDataType[K]>,
    Exclude<InitDataType[K], undefined> | null,
    InitDataType[K]
  >;
};

/**
 * Class which is responsible for displaying Web Apps init data.
 */
export class InitData {
  private readonly state: State<InitDataState>;

  constructor(
    authDate: Date,
    hash: string,
    options: Omit<InitDataType, 'authDate' | 'hash'> = {},
  ) {
    const {
      chat = null,
      canSendAfter = null,
      user = null,
      queryId = null,
      receiver = null,
      startParam = null,
    } = options;
    this.state = new State({
      authDate,
      canSendAfter,
      chat,
      user,
      queryId,
      receiver,
      startParam,
      hash,
    });
  }

  /**
   * Init data generation date.
   */
  get authDate(): Date {
    return this.state.get('authDate');
  }

  /**
   * Date after which a message can be sent via the answerWebAppQuery
   * method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  get canSendAfter(): Date | null {
    return this.state.get('canSendAfter');
  }

  /**
   * An object containing data about the chat where the bot was
   * launched via the attachment menu. Returned for supergroups, channels and
   * group chats – only for Web Apps launched via the attachment menu.
   */
  get chat(): Chat | null {
    return this.state.get('chat');
  }

  /**
   * A hash of all passed parameters, which the bot server can use to
   * check their validity.
   * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
   */
  get hash(): string {
    return this.state.get('hash');
  }

  /**
   * A unique identifier for the Web App session, required for sending
   * messages via the `answerWebAppQuery` method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  get queryId(): string | null {
    return this.state.get('queryId');
  }

  /**
   * An object containing data about the chat partner of the current
   * user in the chat where the bot was launched via the attachment menu.
   * Returned only for private chats and only for Web Apps launched
   * via the attachment menu.
   */
  get receiver(): User | null {
    return this.state.get('receiver');
  }

  /**
   * The value of the `startattach` parameter, passed via link. Only
   * returned for Web Apps when launched from the attachment menu via link.
   */
  get startParam(): string | null {
    return this.state.get('startParam');
  }

  /**
   * An object containing data about the current user.
   */
  get user(): User | null {
    return this.state.get('user');
  }
}
