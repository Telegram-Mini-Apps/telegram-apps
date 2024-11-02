# 关闭行为

负责 Telegram Mini
Apps [关闭行为](../../../../platform/closing-behavior.md) 的💠[组件](../scopes.md)。

## 安装

在使用该组件之前，有必要将其安装到配置正确的
属性中。 为此，请使用 `mount` 方法。 它将更新 `isMounted` 信号属性。

::: code-group

```ts [Variable]
import { closingBehavior } from '@telegram-apps/sdk';

closingBehavior.mount();
closingBehavior.isMounted(); // true
```

```ts [Functions]
import {
  mountClosingBehavior,
  isClosingBehaviorMounted,
} from '@telegram-apps/sdk';

mountClosingBehavior();
isClosingBehaviorMounted(); // true
```

:::

要卸载，请使用 `unmount` 方法：

::: code-group

```ts [Variable]
closingBehavior.unmount();
closingBehavior.isMounted(); // false
```

```ts [Functions]
import {
  unmountClosingBehavior,
  isClosingBehaviorMounted,
} from '@telegram-apps/sdk';

unmountClosingBehavior();
isClosingBehaviorMounted(); //  false
```

:::

## 关闭确认

要更改关闭确认行为，请使用 `enableConfirmation()`
和 `disableConfirmation()` 方法。 这些方法会更新 `isConfirmationEnabled` 信号
的属性值。

::: code-group

```ts [Variable]
closingBehavior.enableConfirmation();
closingBehavior.isConfirmationEnabled(); // true

closingBehavior.disableConfirmation();
closingBehavior.isConfirmationEnabled(); // false
```

```ts [Functions]
import {
  enableClosingConfirmation,
  disableClosingConfirmation,
} from '@telegram-apps/sdk';

enableClosingConfirmation();
isClosingConfirmationEnabled(); // true

disableClosingConfirmation();
isClosingConfirmationEnabled(); // false
```

:::