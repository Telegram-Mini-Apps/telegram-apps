# @tma.js

Mono-repository, containing all the packages, connected with comfortable and safe TypeScript
development on Telegram Mini Apps platform. To learn more about specific packages, follow
their own [documentations](https://docs.telegram-mini-apps.com).

## Templates

The list of Mini Apps templates, using different frontend technologies:

- [React and Vite](https://github.com/Telegram-Mini-Apps/reactjs-template)
- [TypeScript and Vite](https://github.com/Telegram-Mini-Apps/typescript-template)
- [Vanilla JavaScript](https://github.com/Telegram-Mini-Apps/vanillajs-template)
- [Solid and Vite](https://github.com/Telegram-Mini-Apps/solidjs-template)
- [Next JS](https://github.com/Telegram-Mini-Apps/nextjs-template)

## Why not Telegram SDK

Why bother creating a project like `@tma.js` when there are existing solutions from the developers
who own the platform? The answer is rather simple: the currently provided solution (SDK) does not
seem to meet the required minimum quality standards. Of course, the term 'quality' is rather
specific and subjective, but this section should make it more objective.

This project was born during the research of a solution provided by
Telegram - [telegram-web-app.js](https://telegram.org/js/telegram-web-app.js), which is considered
the only existing official SDK for Telegram Mini Apps by Telegram. Therefore, all the points
described in this section will be related to this package.

Because of the large section size, the complete motivation description has been moved to a [separate
document](./MOTIVATION.md).
