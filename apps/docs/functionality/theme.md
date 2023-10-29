# Theme parameters

Mini Apps are web applications which are meant to look native. It includes not only usage of
components which mimic the native components, but parent application colors too.

Mini App is being provided with colors, which are currently used by Telegram app. These colors
should be used by Mini App to look consistently with native application.

[//]: # (TODO: We need more specific information on theme parameters content)

## Getting theme

To start working with theme parameters, developers are allowed to [extract them from launch
parameters](../launch-parameters/common-information#tgwebappthemeparams), or call
special [Telegram Mini Apps method](../apps-communication/methods.md#web-app-request-theme).

## Background and header colors

The developer's application is displayed in a native component, which consists of 2 parts: header
and body. To control their background colors, developers can utilize such Telegram Mini Apps
methods as [web_app_set_header_color](../apps-communication/methods.md#web-app-set-header-color)
and [web_app_set_background_color](../apps-communication/methods.md#web-app-set-background-color)
