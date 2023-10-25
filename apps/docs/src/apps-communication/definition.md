# Definition

To understand how to use Web Apps functionality, we should start by learning how
Telegram native application communicates with Web App.

Depending on the Telegram application, it will create a special
environment for the Web App. For developers, it is enough to know, that this
environment is web-based, but nevertheless, each of them has its own
communication way between the Telegram application and Web App.

To be more accurate, Telegram Mini Apps is not new technology even in the world
of Telegram. Messenger already has such technology as Telegram Games, which is,
internally, almost the same platform as Web Apps. At least, it uses the same way
of communication with the front-end app.

It is currently not known why each platform has its own communication logic, but
we have what we have.

## Methods and events

The next thing important to know is there are 2 terms that are usually used in
the context of apps communication:

- `events` are received by Web App from Telegram app;
- `methods` are called by Web App and executed by Telegram app.

Internally, each of them is the event, but we will use these terms as a
convention to speak the same language.
