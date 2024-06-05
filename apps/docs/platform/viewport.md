# Viewport

The term **Viewport** describes the **visible part** of a Mini App. Since the Mini App can be
displayed differently on various platforms, using viewport information is allowed to ensure the
correct display of the Mini App.

Viewport data is described through four properties:

- The `width` and `height` properties define the dimensions of the visible part of the Mini App.
- The `stability` property is a flag that equals `true` whenever the Mini App is considered as not
  going to change its size in the next moment.
- The `expansion` property is also a flag that equals `true` whenever the Mini App has reached its
  maximum height.

## Views

Applications can be opened in various ways, and each method might present a different visual
representation of the viewport.

For example, an application opened via the menu button will display an input field in the lower part
of the interface. At the same time, opening an application using a direct link will result in the
user not seeing any additional elements in the interface.

<img
  src="/components/viewport/views.png"
  srcset="/components/viewport/views.png, /components/viewport/views@2x.png 2x"
  class="guides-image"
/>

## Expanding

In case, application is opened in mobile version of Telegram (both Android and iOS), it will be
displayed in native component, called `BottomSheet`. It represents draggable from bottom to top
block, which could be expanded to the entire screen size. To do this, user could drag it to the
upper bound of the screen, but developer is able to do it programmatically too.

By default, application is minimized (not expanded), it has minimal allowed height. To expand
application via code, developer should
call [web_app_expand](methods.md#web-app-expand) method.

<img
  src="/components/viewport/expansion.png"
  srcset="/components/viewport/expansion.png, /components/viewport/expansion@2x.png 2x"
  class="guides-image"
/>

During the process of dragging, viewport is considered not stable. For developer, it means, that he
should not probably do any resizes or something like that, as long as viewport dimensions could
change in the next moment.

Other platforms open Mini App already maximized in medium-size window and call
of [web_app_expand](methods.md#web-app-expand) method will have no effect.
