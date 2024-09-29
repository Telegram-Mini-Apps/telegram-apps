# Init Data

The 💠[component](../scopes.md) responsible for the Telegram Mini Apps [init data](../../../../platform/init-data.md).

## Restoring

To restore the init data state, use the `restore` method.

::: code-group

```ts [Variable]
import { initData } from '@telegram-apps/sdk';

initData.restore();
```

```ts [Functions]
import { restoreInitData } from '@telegram-apps/sdk';

restoreInitData();
```

:::

## Properties

::: code-group

```ts [Variable]
initData.authDate(); // Date | undefined
initData.canSendAfter(); // number | undefined
initData.canSendAfterDate(); // Date | undefined
initData.chat(); // Chat | undefined
initData.chatType(); // string | undefined
initData.chatInstance(); // string | undefined
initData.hash(); // string | undefined
initData.queryId(); // string | undefined
initData.raw(); // string | undefined. Raw representation of init data.
initData.receiver(); // User | undefined
initData.startParam(); // string | undefined
initData.state(); // InitData | undefined. Complete init data state
initData.user(); // User | undefined
```

```ts [Functions]
import {
  initDataAuthDate,
  initDataCanSendAfter,
  initDataCanSendAfterDate,
  initDataChat,
  initDataChatType,
  initDataChatInstance,
  initDataHash,
  initDataQueryId,
  initDataRaw,
  initDataReceiver,
  initDataStartParam,
  initDataState,
  initDataUser,
} from '@telegram-apps/sdk';

initDataAuthDate(); // Date | undefined
initDataCanSendAfter(); // number | undefined
initDataCanSendAfterDate(); // Date | undefined
initDataChat(); // Chat | undefined
initDataChatType(); // string | undefined
initDataChatInstance(); // string | undefined
initDataHash(); // string | undefined
initDataQueryId(); // string | undefined
initDataRaw(); // string | undefined. Raw representation of init data.
initDataReceiver(); // User | undefined
initDataStartParam(); // string | undefined
initDataState(); // InitData | undefined. Complete init data state
initDataUser(); // User | undefined
```

:::