# 设置按钮

执行 Telegram 迷你应用程序 [设置按钮](./../../../../platform/settings-button.md)。

## 初始化

要初始化组件，请使用`initSettingsButton`函数：

```typescript
import { initSettingsButton } from '@telegram-apps/sdk';

const [settingsButton] = initSettingsButton()；  
```

## 展示与隐藏

要显示和隐藏 "SettingsButton"，需要使用 "show() "和 "hide() "方法。 这些
方法会更新按钮的 `isVisible` 属性：

```typescript
settingsButton.show();
console.log(settingsButton.isVisible); // true  

settingsButton.hide();
console.log(settingsButton.isVisible); // false  
```

## 活动

可被 [跟踪]（#events）的事件列表：

| 活动                 | 听众                         | 触发条件               |
| ------------------ | -------------------------- | ------------------ |
| 点击                 | `() => void`               | 已点击设置按钮            |
| 改变                 | `() => void`               | 组件中的某些部分发生了变化      |
| `change:isVisible` | `(value: boolean) => void` | 更改了 `isVisible` 属性 |

## 方法支持

方法列表，可用于 [支持检查](#methods-support)：显示
和隐藏
