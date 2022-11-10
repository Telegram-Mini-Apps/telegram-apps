# Viewport

Contains information about current Web App device viewport, its dimensions and
state.

## Props

#### `isExpanded: boolean`

`true`, if the Web App is expanded to the maximum available height. `false`, if
the Web App occupies part of the screen and can be expanded to the full height
using `expand` method.

#### `isStable: boolean`

`true`, in case current viewport height is stable.

#### `height: number`

The current height of the visible area of the Web App.

The application can display just the top part of the Web App, with its lower
part remaining outside the screen area. From this position, the user can "pull"
the Web App to its maximum height, while the bot can do the same by
calling `expand` method. As the position of the Web App changes, the current
height value of the visible area will be updated in real time.

Please note that the refresh rate of this value is not sufficient to smoothly
follow the lower border of the window. It should not be used to pin interface
elements to the bottom of the visible area. It's more appropriate to use the
value of the `stableHeight` field for this purpose.

#### `stableHeight: number`

The height of the visible area of the Web App in its last stable state.

The application can display just the top part of the Web App, with its lower
part remaining outside the screen area. From this position, the user can "pull"
the Web App to its maximum height, while the bot can do the same by
calling `expand` method.

Unlike the value of `height`, the value of `stableHeight` does not change as the
position of the Web App changes with user gestures or during animations. The
value of `stableHeight` will be updated after all gestures and animations are
completed and the Web App reaches its final size.

## Methods

#### `expand(): void`

A method that expands the Web App to the maximum available height. To find out
if the Web App is expanded to the maximum height, refer to the value of
the `isExpanded`.

#### `sync(): Promise<void>`

Requests and applies fresh viewport information from native application.

> ⚠️ This function will show warning in case, current platform
> is desktop or web. See this [issue](https://github.com/Telegram-Web-Apps/client-sdk/issues/7) for more.
