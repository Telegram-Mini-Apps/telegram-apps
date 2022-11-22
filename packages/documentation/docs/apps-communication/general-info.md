---
sidebar_position: 1
---

# General info

To understand how to use Web App functionality, we should start from learning
how Telegram native application communicates with our front-end application.

Depending on the device, Telegram will create special environment for
your application. For developer, it is enough to know, that this environment
is web based, but nevertheless, each of them has some their own features. For
example, by "features", we mean communication way between Telegram native
application and your Web App - each platform has its own.

There are currently 4 platforms (unique name is specified next to platform):

- Android <sup>`android`</sup>
- iOS <sup>`ios`</sup>
- Desktop <sup>`tdesktop`</sup>
- Web <sup>`webz`</sup>

## Methods and events

The next thing you should know, that there are 2 terms which are usually used
in context of apps communication:

- `events` - received by front-end app from native one;
- `methods` - called by front-end app and executed by native one;

Internally, each of them is event, but we will use these terms as convention
to speak the same language.