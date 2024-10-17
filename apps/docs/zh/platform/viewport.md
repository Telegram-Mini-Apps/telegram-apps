# 视口

术语**视口**描述了迷你应用程序的**可见部分**。 由于迷你应用程序在不同平台上的显示方式可能
不同，因此可以使用视口信息来确保迷你应用程序的显示
正确。

视口数据通过四个属性进行描述：

- 宽度 "和 "高度 "属性定义了迷你应用程序可见部分的尺寸。
- 稳定 "属性是一个标志，只要认为迷你应用程序不会在下一时刻改变其大小，
  ，该标志就等于 "true"。
- `expansion` 属性也是一个标志，当迷你应用程序达到
  的最大高度时，该标志等于 `true`。

## 意见

打开应用程序的方式多种多样，每种方式都可能呈现出不同的视
图。

例如，通过菜单按钮打开的应用程序将在界面下方
显示一个输入框。 同时，使用直接链接打开应用程序将导致
用户看不到界面中的任何其他元素。

<img
src="/components/viewport/views.png"
srcset="/components/viewport/views.png, /components/viewport/views@2x.png 2x"
class="guides-image"
/>

## 扩展

如果在 Telegram 的移动版本（Android 和 iOS）中打开应用程序，则会在名为 "BottomSheet "的本地组件中显示
。 它表示可从底部拖动到顶部的
块，可扩展到整个屏幕大小。 要做到这一点，用户可以将其拖动到
屏幕的上限，但开发人员也可以通过编程实现。

默认情况下，应用程序处于最小化（未展开）状态，允许的高度也最小。 要通过代码扩展
应用程序，开发人员应
调用 [web_app_expand](methods.md#web-app-expand) 方法。

<img
src="/components/viewport/expansion.png"
srcset="/components/viewport/expansion.png, /components/viewport/expansion@2x.png 2x"
class="guides-image"
/>

在拖动过程中，视口被认为是不稳定的。 对于开发人员来说，这意味着只要视口尺寸可能在下一
刻发生变化，他
可能就不应该进行任何大小调整或类似操作。

其他平台打开的 Mini App 已在中等大小窗口中最大化，调用
of [web_app_expand](methods.md#web-app-expand) 方法不会有任何效果。
