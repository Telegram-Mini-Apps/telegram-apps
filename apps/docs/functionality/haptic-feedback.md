# Haptic feedback

Native mobile applications are always filled with interactive components, which allow user to
communicate with its functionality. Such components are mostly popups, buttons and many others.

Interacting with application (clicking buttons, closing popups etc.), it is allowed to emit haptic
notifications. Commonly, this process is called **_haptic feedback_**. In simple words, these events
are just mobile device vibrations. Usage of haptic feedback can make user's experience much better.

There are currently 3 types of notifications which are used in separate cases. See links at the end
of the section for more information.

::: tip
Use this method carefully. Emitting haptic events too often can make an effect
on user's mobile device battery.
:::

- [Telegram Mini Apps method](../apps-communication/methods.md#web-app-trigger-haptic-feedback)