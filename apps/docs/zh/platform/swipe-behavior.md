# 刷卡行为

刷卡行为](/functionality/swipe-behavior.png)

迷你应用程序有时使用的轻扫手势可能与最小化和关闭应用程序的手势冲突。
对于用户来说，这可能会表现为在与迷你应用互动时不小心向下滑动以停靠该应用。

为了避免这种情况，开发人员可以选择配置轻扫行为，
，这样在轻扫应用程序本身时，应用程序就不会隐藏在 dock 中。

无论如何，用户仍然可以通过轻扫迷你应用的标题来最小化和关闭迷你应用。

要禁用垂直页面轻扫，Telegram 小应用程序提供了一个名为 [web_app_setup_swipe_behavior] 的方法
（methods.md#web-app-setup-swipe-behavior）。
