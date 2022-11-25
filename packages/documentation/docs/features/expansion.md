# Expansion

## Mobile

In case, application is opened in mobile version of Telegram (both Android and
iOS), it will be displayed in native component, called `BottomSheet`. It
represents draggable block, which could be expanded to the entire screen size. To
do this, user could drag it to the upper bound of the screen, but developer is
able to do it programmatically too.

By default, application is minimized, it has minimal allowed height. To expand
application via code, developer should
call [`web_app_expand`](../apps-communication/methods-list.md#web_app_expand)
method. This will lead application to be fully displayed.

## Other platforms

Other platforms open Web App already maximized in medium-size window, and call
of `web_app_expand` method will have no effect.