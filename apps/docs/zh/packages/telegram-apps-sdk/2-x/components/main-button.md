# 主按钮

负责 Telegram Mini
Apps [main button](../../../../.platform/main-button.md) 的💠[组件](../scopes.md)。

## 安装

在使用该组件之前，有必要将其安装到配置正确的
属性中。 为此，请使用 `mount` 方法。 它将更新 `isMounted` 信号属性。

::: code-group

```ts [Variable]
import { mainButton } from '@telegram-apps/sdk';

mainButton.mount();
mainButton.isMounted(); // true
```

```ts [Functions]
import { mountMainButton, isMainButtonMounted } from '@telegram-apps/sdk';

mountMainButton();
isMainButtonMounted(); // true
```

:::

要卸载，请使用 `unmount` 方法：

::: code-group

```ts [Variable]
mainButton.unmount(); 
mainButton.isMounted(); // false
```

```ts [Functions]
import { unmountMainButton, isMainButtonMounted } from '@telegram-apps/sdk';

unmountMainButton();
isMainButtonMounted(); // false
```

:::

> [!WARNING]
> 该组件的属性取决于 [主题参数](theme-params.md) 组件中的值。
> 使用主按钮前，请务必安装主题参数。

## 设置属性

要更新按钮属性，请使用 `setParams` 方法。 它接受一个带有可选
属性的对象，每个属性负责各自的按钮特性。

反过来，调用该方法会更新
，如 `backgroundColor`, `hasShineEffect`, `isVisible`, `isEnabled`, `isLoaderVisible`, `state`, `textColor`
和 `text`。

::: code-group

```ts [Variable]
mainButton.setParams({
  backgroundColor: '#000000',
  hasShineEffect: true,
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  text: 'My text',
  textColor: '#ffffffff'
});
mainButton.backgroundColor(); // '#000000'
mainButton.hasShineEffect(); // true
mainButton.isEnabled(); // true
mainButton.isLoaderVisible(); // true
mainButton.isVisible(); // true
mainButton.text(); // 'My text'
mainButton.textColor(); // '#ffffffff'

mainButton.state();
// {
// backgroundColor: '#000000',
// hasShineEffect: true,
// isActive: true,
// isLoaderVisible: true,
// isVisible: true,
// text: 'My text',
// textColor: '#ffffffff'
// }
```

```ts [Functions]
import {
  setMainButtonParams,
  mainButtonBackgroundColor,
  mainButtonHasShineEffect,
  isMainButtonVisible,
  isMainButtonEnabled,
  isMainButtonLoaderVisible,
  mainButtonState,
  mainButtonTextColor,
  mainButtonText,
} from '@telegram-apps/sdk'；

setMainButtonParams({
  backgroundColor：'#000000',
  hasShineEffect: true,
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  text: 'My text',
  textColor：'#ffffffff'
});
mainButtonBackgroundColor(); // '#000000'
mainButtonHasShineEffect(); // true
isMainButtonEnabled(); // true
isMainButtonLoaderVisible()；// true
isMainButtonVisible(); // true
mainButtonText(); // 'My text'
mainButtonTextColor(); // '#ffffffffff'

mainButtonState();
// {
// backgroundColor：'#000000',
// hasShineEffect: true,
// isActive: true,
// isLoaderVisible: true,
// isVisible: true,
// text: 'My text',
// textColor: '#ffffffff'
// }
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

const offClick = mainButton.onClick(listener);
offClick();
// or
mainButton.onClick(listener);
mainButton.offClick(listener)；
```

```ts [Functions]
import {
  onMainButtonClick,
  offMainButtonClick,
} from '@telegram-apps/sdk';

function listener() {
  console.log('Clicked！');
}

const offClick = onMainButtonClick(listener);
offClick();
// or
onMainButtonClick(listener);
offMainButtonClick(listener)；
```

:::
