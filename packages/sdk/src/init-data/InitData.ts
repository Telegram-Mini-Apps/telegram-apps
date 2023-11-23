import { State } from '~/state/index.js';

import { initDataParser } from './initDataParser.js';
import { serializeInitData } from './serializeInitData.js';
import type { Chat, ChatType, InitDataParsed, User } from './types.js';

/**
 * Class which is responsible for displaying Mini Apps init data.
 */
export class InitData {
  /**
   * Parses incoming value as init data.
   * @param value - value to parse.
   */
  static parse(value: unknown): InitDataParsed {
    return initDataParser().parse(value);
  }

  private readonly state: State<InitDataParsed>;

  constructor(initData: InitDataParsed) {
    this.state = new State(initData);
  }

  /**
   * @see InitDataParsed.authDate
   */
  get authDate(): Date {
    return this.state.get('authDate');
  }

  /**
   * @see InitDataParsed.canSendAfter
   */
  get canSendAfter(): number | undefined {
    return this.state.get('canSendAfter');
  }

  /**
   * Returns date after which it is allowed to call
   * the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
   */
  get canSendAfterDate(): Date | undefined {
    const { canSendAfter } = this;

    return canSendAfter === undefined
      ? undefined
      : new Date(this.authDate.getTime() + canSendAfter * 1000);
  }

  /**
   * @see InitDataParsed.chat
   */
  get chat(): Chat | undefined {
    return this.state.get('chat');
  }

  /**
   * @see InitDataParsed.chatType
   */
  get chatType(): ChatType | undefined {
    return this.state.get('chatType');
  }

  /**
   * @see InitDataParsed.chatInstance
   */
  get chatInstance(): string | undefined {
    return this.state.get('chatInstance');
  }

  /**
   * @see InitDataParsed.hash
   */
  get hash(): string {
    return this.state.get('hash');
  }

  /**
   * @see InitDataParsed.queryId
   */
  get queryId(): string | undefined {
    return this.state.get('queryId');
  }

  /**
   * @see InitDataParsed.receiver
   */
  get receiver(): User | undefined {
    return this.state.get('receiver');
  }

  /**
   * @see InitDataParsed.startParam
   */
  get startParam(): string | undefined {
    return this.state.get('startParam');
  }

  /**
   * Serializes this instance to value, sent from the Telegram application.
   */
  serialize(): string {
    return serializeInitData(this.state.clone());
  }

  /**
   * @see InitDataParsed.user
   */
  get user(): User | undefined {
    return this.state.get('user');
  }
}
