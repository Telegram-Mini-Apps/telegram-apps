# 设置按钮

负责 Telegram Mini
Apps [settings button](../../../../platform/settings-button.md) 的💠[组件](../scopes.md)。

## 检查支持

要检查当前 Telegram 迷你应用程序版本是否支持设置按钮，可使用
`isSupported` 方法：

::: code-group

```ts [Variable]
import { settingsButton } from '@telegram-apps/sdk';

settingsButton.isSupported(); // boolean
```

```ts [Functions]
import { isSettingsButtonSupported } from '@telegram-apps/sdk';

isSettingsButtonSupported(); // boolean
```

:::

## 安装

在使用该组件之前，有必要将其安装到正确配置的属性中。
为此，请使用 `mount` 方法。 它将更新 `isMounted` 信号属性。

::: code-group

```ts [Variable]
import { settingsButton } from '@telegram-apps/sdk';

settingsButton.mount();
settingsButton.isMounted(); // true
```

```ts [Functions]
import {
  mountSettingsButton,
  isSettingsButtonMounted,
} from '@telegram-apps/sdk';

mountSettingsButton();
isSettingsButtonMounted(); // true
```

:::

要卸载，请使用 `unmount` 方法：

::: code-group

```ts [Variable]
settingsButton.unmount();
settingsButton.isMounted(); // false
```

```ts [Functions]
import { 
  unmountSettingsButton,
  isSettingsButtonMounted,
} from '@telegram-apps/sdk';

unmountSettingsButton();
isSettingsButtonMounted(); // false
```

:::

## 展示与隐藏

要更改按钮的可见性，请使用 `hide()` 和 `show()` 方法。 这些方法会更新
`isVisible` 信号属性值。

::: code-group

```ts [Variable]
settingsButton.show();
settingsButton.isVisible(); // true

settingsButton.hide();
settingsButton.isVisible(); // false
```

```ts [Functions]
import {
  showSettingsButton,
  hideSettingsButton,
  isSettingsButtonVisible,
} from '@telegram-apps/sdk';

showSettingsButton();
isSettingsButtonVisible(); // true

hideSettingsButton();
isSettingsButtonVisible(); // false
```

:::

## 跟踪点击

要添加按钮点击监听器，请使用 `onClick` 方法。 它返回一个函数，用于移除绑定的
监听器。 或者，您也可以使用 `offClick` 方法。

::: code-group

```ts [Variable]
function listener() {
  console.log('Clicked!');
}

const offClick = settingsButton.onClick(listener);
offClick();
// or
settingsButton.onClick(listener);
settingsButton.offClick(listener)；
```

```ts [Functions]
import { onSettingsButtonClick, offSettingsButtonClick } from '@telegram-apps/sdk';

function listener() {
  console.log('Clicked!');
}

const offClick = onSettingsButtonClick(listener);
offClick();
// or
onSettingsButtonClick(listener);
offSettingsButtonClick(listener)；
```

:::
