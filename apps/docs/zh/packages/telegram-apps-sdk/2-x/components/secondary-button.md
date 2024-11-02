# 辅助按钮

负责 Telegram 迷你应用程序二级按钮的💠[组件](../scopes.md)。

## 检查支持

要检查当前 Telegram 迷你应用程序版本是否支持辅助按钮，请使用
`isSupported` 方法：

::: code-group

```ts [Variable]
import { secondaryButton } from '@telegram-apps/sdk';

secondaryButton.isSupported(); // boolean
```

```ts [Functions]
import { isSecondaryButtonSupported } from '@telegram-apps/sdk';

isSecondaryButtonSupported(); // boolean
```

:::

## 安装

在使用该组件之前，有必要将其安装到配置正确的
属性中。 为此，请使用 `mount` 方法。 它将更新 `isMounted` 信号属性。

::: code-group

```ts [Variable]
import { secondaryButton } from '@telegram-apps/sdk';

secondaryButton.mount();
secondaryButton.isMounted(); // true
```

```ts [Functions]
import {
  mountSecondaryButton,
  isSecondaryButtonMounted,
} from '@telegram-apps/sdk';

mountSecondaryButton();
isSecondaryButtonMounted(); // true
```

:::

要卸载，请使用 `unmount` 方法：

::: code-group

```ts [Variable]
secondaryButton.unmount();
secondaryButton.isMounted(); // false
```

```ts [Functions]
import {
  unmountSecondaryButton,
  isSecondaryButtonMounted,
} from '@telegram-apps/sdk';

unmountSecondaryButton();
isSecondaryButtonMounted(); // false
```

:::

> [!WARNING]
> 该组件的属性取决于 [Mini App](mini-app.md)
> 和 [Theme Params](theme-params.md) 组件的值。 具体来说，二级按钮使用 Mini
> App 的 `bottomBarBgColor` 和一些主题参数颜色。 在使用辅助按钮之前，请确保将这些组件安装到
> 。

## 设置属性

要更新按钮属性，请使用 `setParams` 方法。 它接受一个带有可选
属性的对象，每个属性负责各自的按钮特性。

反过来，调用该方法会更新
，如 `backgroundColor`, `hasShineEffect`, `isVisible`, `isEnabled`, `isLoaderVisible`, `position`,
`state`, `textColor` 和 `text`。

::: code-group

```ts [Variable]
secondaryButton.setParams({
  backgroundColor: '#000000',
  hasShineEffect: true,
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  position: 'top',
  text: 'My text',
  textColor: '#ffffff'
});
secondaryButton.backgroundColor(); // '#000000'
secondaryButton.hasShineEffect(); // true
secondaryButton.isEnabled(); // true
secondaryButton.isLoaderVisible(); // true
secondaryButton.isVisible(); // true
secondaryButton.position(); // 'top'
secondaryButton.text(); // 'My text'
secondaryButton.textColor(); // '#ffffff'

secondaryButton.state();
// {
//   backgroundColor: '#000000',
//   hasShineEffect: true,
//   isActive: true,
//   isLoaderVisible: true,
//   isVisible: true,
//   position: 'top',
//   text: 'My text',
//   textColor: '#ffffff'
// }
```

```ts [Functions]
import {
  setSecondaryButtonParams,
  secondaryButtonBackgroundColor,
  secondaryButtonHasShineEffect,
  isSecondaryButtonVisible,
  isSecondaryButtonEnabled,
  isSecondaryButtonLoaderVisible,
  secondaryButtonState,
  secondaryButtonTextColor,
  secondaryButtonText,
  secondaryButtonPosition,
} from '@telegram-apps/sdk';

setSecondaryButtonParams({
  backgroundColor: '#000000',
  hasShineEffect: true,
  isEnabled: true,
  isLoaderVisible: true,
  isVisible: true,
  position: 'top',
  text: 'My text',
  textColor: '#ffffff'
});
secondaryButtonBackgroundColor(); // '#000000'
secondaryButtonHasShineEffect(); // true
isSecondaryButtonEnabled(); // true
isSecondaryButtonLoaderVisible(); // true
isSecondaryButtonVisible(); // true
secondaryButtonPosition(); // 'top'
secondaryButtonText(); // 'My text'
secondaryButtonTextColor(); // '#ffffff'

secondaryButtonState();
// {
//   backgroundColor: '#000000',
//   hasShineEffect: true,
//   isActive: true,
//   isLoaderVisible: true,
//   isVisible: true,
//   position: 'top',
//   text: 'My text',
//   textColor: '#ffffff'
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

const offClick = secondaryButton.onClick(listener);
offClick();
// or
secondaryButton.onClick(listener);
secondaryButton.offClick(listener);
```

```ts [Functions]
import {
  onSecondaryButtonClick,
  offSecondaryButtonClick,
} from '@telegram-apps/sdk';

function listener() {
  console.log('Clicked!');
}

const offClick = onSecondaryButtonClick(listener);
offClick();
// or
onSecondaryButtonClick(listener);
offSecondaryButtonClick(listener);
```

:::
