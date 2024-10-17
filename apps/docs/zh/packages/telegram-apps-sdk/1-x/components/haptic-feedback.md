# 触觉反馈

实现 Telegram Mini
Apps [haptic feedback](../../../../.platform/haptic-feedback.md) 功能。

::: info

如果此功能在您的设备上不起作用：请检查设置。 例如，
Android 手机系统，需要进入_"设置" > "声音和振动" >
"振动和触觉"_，找到_"触摸反馈"_选项。 不应\*\*\*为
0。

:::

## 初始化

要初始化组件，请使用 "initHapticFeedback "函数：

```typescript
import { initHapticFeedback } from '@telegram-apps/sdk';

const hapticFeedback = initHapticFeedback()；  
```

## 通知

`HapticFeedback` 支持 3 种触觉事件 - `impactOccurred`, `notificationOccurred`
和 `selectionChanged`。

### 影响发生

一种方法表明发生了撞击。 Telegram 应用程序可根据
传递的样式值播放适当的触觉效果。 发生触觉事件时的撞击方式：

- light"，表示小型或轻量级用户界面对象之间发生碰撞
- medium"，表示中等大小或中等重量的用户界面对象之间发生碰撞
- 重"，表示大型或重量级 UI 对象之间发生碰撞
- 刚性"，表示硬质或不灵活的用户界面对象之间发生碰撞
- 软"，表示软性或柔性 UI 对象之间发生碰撞

```typescript
hapticFeedback.impactOccurred('medium')；
```

### 发生通知

一个方法可以说明任务或操作成功、失败或产生警告。 Telegram 应用程序
可根据传递的类型值播放相应的触觉效果。 发生的通知类型
事件。

- `error` 表示任务或操作失败、
- 成功"，表示任务或操作已成功完成、
- 警告"，表示某项任务或操作产生了警告。

```typescript
hapticFeedback.notificationOccurred('success')；
```

### 选择改变

一种告知用户已更改选择的方法。

```typescript
hapticFeedback.selectionChanged()；
```

## 方法支持

方法列表，可用于 [支持检查](#methods-support)：
已发生通知"、"已发生影响 "和 "已更改选择"。
