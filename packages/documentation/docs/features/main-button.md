---
sidebar_position: 4
---

# Main button

Main button is placed at the bottom of Telegram interface. It is rather big
native component which provides mostly basic features.

![main-button.png](../../static/docs/main-button.png)

Common use case for main button is to submit data. User could fill some form
and then, click this button to submit it. Main button can be disabled, this will
make it non-clickable and as a result, application will not receive click event.

Additionally, developer is allowed to control button's background and text
colors, text and loader visibility. You could use button loader to make user
sure, application is not frozen. This will let him know that application is
performing some long action - making request, for example.

![main-button-2.png](../../static/docs/main-button-2.png)

- [Web App method](../apps-communication/methods#web_app_setup_main_button)
- [Button clicked event](../apps-communication/events#main_button_pressed)