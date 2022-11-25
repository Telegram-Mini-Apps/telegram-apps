# Theming

Web Apps are web applications which are meant to look native. It includes not
only usage of components which mimics the native components, but parent
application colors too.

Web App is being provided with colors, which are currently used by Telegram app.
These colors should be used by Web App to look consistently with native
application.

## Getting theme

To learn how to get theme information, you will probably need these links:

- [Getting from launch parameters](../launch-params#tgwebappthemeparams)
- [Getting with Web Apps method](../apps-communication/methods-list.md#web_app_request_theme)

## Changing colors

Nevertheless, we forgot something important. Developer could change some colors
by himself. To do this, he should
use [`web_app_set_background_color`](../apps-communication/methods-list.md#web_app_set_background_color)
and [`web_app_set_header_color`](../apps-communication/methods-list.md#web_app_set_header_color)
, which will update background and header colors respectively.

:::caution

Don't forget to check if current Web App version supports these methods.

:::