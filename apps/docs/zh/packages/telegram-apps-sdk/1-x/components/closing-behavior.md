# 关闭行为

执行 Telegram Mini
Apps [closing behavior](../../../../.platform/closing-behavior.md) 功能。

## 初始化

要初始化组件，请使用 `initClosingBehavior` 函数：

```typescript
import { initClosingBehavior } from '@telegram-apps/sdk';

const [closingBehavior] = initClosingBehavior()；  
```

## 闭幕确认

要启用或禁用关闭确认，需要使用 `enableConfirmation()`
和 `disableConfirmation()` 方法。 这些方法会更新 `isConfirmationNeeded` 属性：

```typescript
closingBehavior.enableConfirmation();
console.log(closingBehavior.isConfirmationNeeded); // true  

closingBehavior.disableConfirmation();
console.log(closingBehavior.isConfirmationNeeded); // false
```

## 活动

可被 [跟踪]（#events）的事件列表：

| 活动                                                      | 听众                         | 触发条件                          |
| ------------------------------------------------------- | -------------------------- | ----------------------------- |
| 改变                                                      | `() => void`               | 组件中的某些部分发生了变化                 |
| change:isConfirmationNeeded\` 变更：是否需要确认 | `(value: boolean) => void` | 已更改 `isConfirmationNeeded` 属性 |
