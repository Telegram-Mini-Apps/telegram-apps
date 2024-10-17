# 触觉反馈

负责 Telegram Mini
Apps [触觉反馈]（.../.../.../平台/触觉反馈.md）的💠[组件]（.../scopes.md）。

## 检查支持

要检查当前 Telegram 迷你应用程序版本是否支持触觉反馈，需要使用
`isSupported` 方法：

::: code-group

```ts [Variable]
import { hapticFeedback } from '@telegram-apps/sdk';

hapticFeedback.isSupported(); // boolean
```

```ts [Functions]
import { isHapticFeedbackSupported } from '@telegram-apps/sdk';

isHapticFeedbackSupported(); // boolean
```

:::

## 发生影响

`impactOccurred` 是发出撞击事件信号的方法。 Telegram 应用程序可根据传递的样式值播放
适当的触觉反馈。

::: code-group

```ts [Variable]
hapticFeedback.impactOccurred('medium')；
```

```ts [Functions]
import { hapticFeedbackImpactOccurred } from '@telegram-apps/sdk';

hapticFeedbackImpactOccurred('medium')；
```

:::

冲击触觉事件的可用样式有

- light\`：表示小型或轻量级用户界面对象之间发生碰撞。
- medium"：表示中等大小或中等重量的用户界面对象之间发生碰撞。
- heavy\`：表示大型或重量级 UI 对象之间发生碰撞。
- rigid\`：表示硬质或不灵活的用户界面对象之间发生碰撞。
- soft\`：表示软性或柔性用户界面对象之间发生碰撞。

## 发生通知

notificationOccurred "是一种方法，用于发出任务或操作成功、失败或
触发警告的信号。 Telegram 应用程序可根据传递的类型
值播放适当的触觉反馈。

::: code-group

```ts [Variable]
hapticFeedback.notificationOccurred('success')；
```

```ts [Functions]
import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk';

hapticFeedbackNotificationOccurred('success')；
```

:::

通知事件的类型有

- `error`: 表示任务或操作失败。
- 成功"：表示任务或操作已成功完成。
- 警告"：表示某项任务或操作触发了警告。

## 更改了选择

selectionChanged "是用户更改选择时发出信号的方法。 Telegram 应用程序可能会
播放相应的触觉反馈。

只有在选择发生变化时，而不是在做出或确认选择时，才使用此反馈。

代码组

```ts [Variable]
hapticFeedback.selectionChanged()；
```

```ts [Functions]
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk';

hapticFeedbackSelectionChanged()；
```
