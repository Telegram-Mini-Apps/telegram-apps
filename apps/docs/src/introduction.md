# Introduction

## About platform

Telegram Mini Apps is a technology created by developers of the famous messenger
Telegram.
The main it’s purpose is to provide developers more flexible communication
channel with Telegram users.

It may seem not clear, but Web Apps are not self-served services. The first
thing to note is, technically, this technology is just an add-on for such
already-known Telegram functionality as Telegram Bots. So, currently, creating a
Web App without creating a Telegram Bot is not available.

The platform offers a high variety of available methods to communicate with the
Telegram application to make your web applications look more native, allow them
to simulate native application's behavior, and, finally, **mimic** native
applications.

## Required technologies

Before starting to create an application on the Web Apps platform, it is
important to know what Web Apps is from its technical side. This will lead the
developer to language and technologies selection.

Internally, Web Apps are usual web applications, which are displayed in WebView.
In other words, they are just a set of static files (mostly `.js`, `.css`,
and `.html`). So, to create Web App, it is enough to learn standard front-end
development technologies, such as:

- JavaScript
- CSS
- HTML

Really simple, isn't it? But to make much more serious and bigger applications,
we recommend using more solid technologies, such
as `TypeScript`, `React`, `SCSS`, etc.

So, if we want to create Web App, we should create a standard web application
with any technologies stack. The only 1 thing Telegram needs from the developer
is the application URL to download it from. It will be used as a source for
WebView, which will lead to application download and display.

## Usage

As we mentioned in the previous section, Web Apps are add-ons for Telegram Bots.
Telegram Bots is also known technology that provides functionality for a wide
list of use cases. You could create a bot to buy a ticket in the cinema, make
him tell user jokes, generate random numbers, etc. In other words, the bot can
do whatever the developer thinks about.

The problem is, the visual part of bots is not as good and functional as it
could be. Their current implementation is "console-like" which is more
appropriate for developers, not common users. That's the time for Web Apps to
show up.

Using Web Apps, developers are allowed to create more user-friendly and complex
interfaces, which are commonly used by usual users. With this technology, the
developer is still able to communicate with the bot behind Web App, but,
additionally, he can provide some more flexible interfaces to interact with.

Web Apps are usually used when a standard bot interface is not enough. Create a
Web App when you want to make user life easier when displaying several buttons
is not even close to the functionality, you want to provide.