# About Platform

Telegram Mini Apps is a technology created by developers of the famous messenger Telegram. The main
it’s purpose is to provide developers more flexible communication channel with Telegram users.

It may seem not clear, but Mini Apps are not self-served services. The first thing to note is,
technically, this technology is just an add-on for such already-known Telegram functionality as
Telegram Bots. So, currently, creating a Mini App without creating a Telegram Bot is not available.

The platform offers a high variety of available methods to communicate with the Telegram application
to make your web applications look more native, allow them to simulate native application's
behavior, and, finally, **mimic** native applications.

## Required Technologies

Before starting to create an application on the Mini Apps platform, it is important to know what
Mini Apps is from its technical side. This will lead the developer to language and technologies
selection.

Internally, Mini Apps are usual web applications, which are displayed in WebView. In other words,
they are just a set of static files (mostly `.js`, `.css`, and `.html`). So, to create Mini App, it
is enough to learn standard front-end development technologies, such as:

- JavaScript
- CSS
- HTML

Really simple, isn't it? But to make much more serious and bigger applications, we recommend using
more solid technologies, such as `TypeScript`, `React`, `SCSS`, etc.

So, if we want to create Mini App, we should create a standard web application with any technologies
stack. The only 1 thing Telegram needs from the developer is the application URL to download it
from. It will be used as a source for WebView, which will lead to application download and display.

## Usage

As we mentioned in the previous section, Mini Apps are add-ons for Telegram Bots. Telegram Bots is
also known technology that provides functionality for a wide list of use cases. You could create a
bot to buy a ticket in the cinema, make him tell user jokes, generate random numbers, etc. In other
words, the bot can do whatever the developer thinks about.

The problem is, the visual part of bots is not as good and functional as it could be. Their current
implementation is "console-like" which is more appropriate for developers, not common users. That's
the time for Mini Apps to show up.

Using Mini Apps, developers are allowed to create more user-friendly and complex interfaces, which
are commonly used by usual users. With this technology, the developer is still able to communicate
with the bot behind Mini App, but, additionally, he can provide some more flexible interfaces to
interact with.

Mini Apps are usually used when a standard bot interface is not enough. Create a Mini App when you
want to make user life easier when displaying several buttons is not even close to the
functionality, you want to provide.

## Supported Applications

Currently, Telegram Mini Apps is presented on the wide list of Telegram
applications:

- [Telegram for Android](https://github.com/DrKLO/Telegram) `android`;
- [Telegram for iOS](https://github.com/TelegramMessenger/Telegram-iOS) `ios`;
- [Telegram for macOS](https://github.com/overtake/TelegramSwift) `macos`;
- [Telegram Desktop](https://github.com/telegramdesktop/tdesktop) `tdesktop`;
- [Telegram Web A](https://github.com/Ajaxy/telegram-tt) `web`;
- [Telegram Web K](https://github.com/morethanwords/tweb) `webk`;

Other applications either don't have implementation for Telegram Mini Apps, or
support it too poorly. This will probably be useful in the next sections of the
documentation.

::: info

As long as all applications are being developed separately, there may be variations in how they
implement the platform. If you encounter unexpected differences, please consider reporting
an [issue](https://github.com/Telegram-Mini-Apps/issues).

:::
