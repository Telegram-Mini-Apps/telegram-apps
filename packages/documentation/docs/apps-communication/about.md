---
sidebar_position: 1
---

# About

To understand how to use Web Apps functionality, we should start from learning
how Telegram native application communicates with Web App.

Depending on the [platform](../platforms), Telegram will create
special environment for Web App. For developer, it is enough to know, that this
environment is web-based, but nevertheless, each of them has its own
communication way between Telegram native application and Web App.

To be more accurate, Telegram Web Apps is not new technology even in world of
Telegram. Messenger already has such technology as Telegram Games, which is,
internally, is almost the same platform as Web Apps. At least, it uses the same
way of communication with front-end app.

It is currently not known why each platform has its own communication logic, but
we have what we have.

## Methods and events

The next thing important to know is there are 2 terms which are usually used in
context of apps communication:

- `events` - received by Web App from Telegram app;
- `methods` - called by Web App and executed by Telegram app;

Internally, each of them is event, but we will use these terms as convention to
speak the same language.