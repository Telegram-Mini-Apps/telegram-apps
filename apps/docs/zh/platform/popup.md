# 弹出窗口

![弹出窗口](/components/popup.png)

弹出窗口是位于迷你应用程序顶部的一个组件。 其典型用例是请求
用户确认以执行操作。 Telegram Mini Apps 允许指定弹出标题、消息
和多达 3 个可配置按钮的列表。

要显示弹出窗口，开发者可以使用
[web_app_open_popup](methods.md#web-app-open-popup) Telegram 迷你应用程序
方法。 当用户按下任何弹出按钮时，Telegram 应用程序会发送
[popup_closed](events.md#popup-closed) 事件，并传递
点击按钮的标识符。
