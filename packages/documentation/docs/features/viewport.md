# Viewport

By term *Viewport*, we mean information about current **visible part** of Web
App. As long as Web App can be shown differently on platforms, we should use
viewport information from Telegram to display application correctly.

The most important properties here are `stability`, `expansion`, `height`
and `width`. We will explain first two of them in the next sections of
documentation, but `height` and `width` are worthy of attention right here.
By `height` and `width`, we mean dimensions of **visible part** of application,
not Web View.

## Mobile

In case, application is opened in mobile version of Telegram (both Android and
iOS), it will be displayed in native component, called `BottomSheet`. It
represents draggable from bottom to top block, which could be expanded to the
entire screen size. To do this, user could drag it to the upper bound of the
screen, but developer is able to do it programmatically too.

By default, application is minimized (not expanded), it has minimal allowed
height. To expand application via code, developer should
call [`web_app_expand`](../apps-communication/methods#web_app_expand) method.

During the process of dragging, viewport is considered not stable. For
developer, it means, that he should not probably do any resizes or something
like that, as long as viewport dimensions could change in the next moment.

## Other platforms

Other platforms open Web App already maximized in medium-size window and call
of [`web_app_expand`](../apps-communication/methods#web_app_expand) method will
have no effect.