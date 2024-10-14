# 刷卡行为

执行 Telegram 迷你应用程序 [轻扫行为](.../.../.../.../platform/swipe-behavior.md) 功能。

## 初始化

要初始化组件，请使用`initSwipeBehavior`函数：

```typescript
import { initSwipeBehavior } from '@telegram-apps/sdk';

const [swipeBehavior] = initSwipeBehavior()；  
```

## 垂直刷卡

默认情况下，用户可以通过向下滑动应用程序来隐藏应用程序。
为防止可能出现的关闭，可通过调用 `disableVerticalSwipe()`
方法禁用此行为，或通过 `enableVerticalSwipe()` 方法启用此行为。 反过来，
这两个方法都会更新 `isVerticalSwipeEnabled` 属性：

```typescript
swipeBehavior.enableVerticalSwipe();
console.log(swipeBehavior.isVerticalSwipeEnabled); // true  

swipeBehavior.disableVerticalSwipe();
console.log(swipeBehavior.isVerticalSwipeEnabled); // false
```

## 活动

可被 [跟踪]（#events）的事件列表：

| 活动                                                       | 听众                         | 触发条件                            |
| -------------------------------------------------------- | -------------------------- | ------------------------------- |
| 改变                                                       | `() => void`               | 组件中的某些部分发生了变化                   |
| change:isVerticalSwipeEnabled\`（启用垂直轻扫功能 | `(value: boolean) => void` | 更改了 `isVerticalSwipeEnabled` 属性 |

## 方法支持

方法列表，可用于 [支持检查](#methods-support)：
disableVerticalSwipe`、`enableVerticalSwipe\`。
