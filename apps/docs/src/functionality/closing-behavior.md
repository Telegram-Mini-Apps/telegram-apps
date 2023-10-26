[//]: # (FIXME: This page needs better screenshots of components. Current are horrible.)

# Closing behavior

It is rather common for Mini Apps, when user accidentally closes application during scrolling it to
top. The problem is user could drag application block too much which will result in application
close.

To prevent user from doing this, you could use closing behaviour. Telegram Mini Apps allows
developer to prompt if user really wants to close application. This functionality could also be used
during filling some big forms or something like that. Just not to lose progress.

<img
  src="/components/closing-confirmation.png"
  alt="Closing confirmation"
  width="300"
/>

- [Telegram Mini Apps method](../apps-communication/methods#web-app-setup-closing-behavior)
