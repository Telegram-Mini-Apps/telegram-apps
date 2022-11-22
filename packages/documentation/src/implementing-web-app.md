# Implementing Web App

In this article we are going to go deep into creation process of new Web App on
Telegram Web Apps platform. It is assumed, that you already have experience in
creating new web application with usage of some popular frontend libraries like
Angular, React or Vue etc. Nevertheless, it is not restricted to use vanilla JS.

## Table of contents

- [Technologies stack](#technologies-stack)
- [Creating Telegram bot](#creating-telegram-bot)
- [Getting and applying https link](#getting-and-applying-https-link)
  - [Development](#development)
    - [Hot reload](#hot-reload)
    - [Ngrok](#ngrok)
  - [Production](#production)
  - [Applying link](#applying-link)
- [Debugging application](#debugging-application)

## Technologies stack

Internally, Web Apps are usual web applications which have their own download
URL. So, it is enough to learn standard front-end development technologies to
create simple Telegram Web App.

Here comes the list of these technologies:

1. JavaScript
2. CSS
3. HTML

## Creating Telegram bot

It may seem not clear, but Web Apps are not self-served services. Technically,
this technology is just an add-on for such already known Telegram’s
functionality as Telegram Bots. So, currently, it is not available to create Web
App without creating a bot. To do so, find “father” of all
bots — [BotFather](https://t.me/botfather).

The next step is to send message, which will start procedure of creating new
bot: `/newbot`. Father will start asking questions about new bot information and
as a result, you will get new account with specified name which is your newly
created bot. The only 1 thing we need from it — its secret key which is used in
procedure of signing init data.

After bot is successfully created, we should follow new step — get and apply
application https link which is used to show application.

## Getting and applying https link

This step is required in Web Apps development flow. The reason is, Web Apps are
always presented as usual web applications and, as we know, default way of
getting web application is to get it by some URL.

Talking about Web Apps, it is required to have URL with https protocol only, not
http. BotFather will not allow you to pass link with http protocol because it is
not safe. Additionally, passed https link should have valid SSL-certificate.
Otherwise, your application will not be shown.

As long as production and development links are usually used for different
purposes, we will describe their receiving separately.

### Development

Application development is rather hard process which is usually observed in real
time by developer. It is common, that while developing application, you want to
see all changes directly on device.

#### Hot reload

To see all changes in real-time, it is required to use such functionality as *
hot reload*. In this section we will not describe what hot reload deeply is, but
in two words, it is just a library which allows developers to reload parts of
the code in real-time and display result.

To develop with comfort, you will probably need to get it for your current
frontend architecture. Usually, all default templates for popular frontend
frameworks already include this feature and its configuration is not required.

#### Ngrok

By default, developers has no easy way to get valid https link which will refer
external client to your PC with specified port. To solve this problem, you could
use such service as [ngrok](https://ngrok.com/). It has enough good restrictions
to comfortably develop your application.

Here comes an example of creating a tunnel to `localhost:3000`:

```bash
ngrok http --region eu 3000
```

> ⚠️ **WARNING**: Do not use this link in production. Frontend application
> should be placed on some hosting and downloaded as set of already prepared
> static assets. See next section for more information.

### Production

Getting production-ready URL is not that hard task. To get required link, it is
enough to use rather popular services, such as:

1. [GitHub Pages](https://pages.github.com/)
2. [Heroku](https://www.heroku.com/)
3. [Vercel](https://vercel.com/)

In case, you don’t want to use public hosting, you could create your own server
which serves applications static files. But don’t forget that you still need
valid https link, that means, you should have your own DNS name and valid SSL
certificate. For this purpose, you could use [certbot](https://certbot.eff.org/)
.

### Applying link

When https link is already received, it is required to set it in your bot. To do
this, we should return to BotFather and send message `/setmenubutton`. Then,
BotFather will ask you to choose bot and pass link to apply.

As a result, when user enters a chat with your bot, he will be able to open Web
App by clicking bottom left button (which is usually called `menu button`). It
is worth mentioning, that it is not the only one way of opening Web App. This
way of setting https link applies it for each Telegram user, but you are able to
pass specific link for any specific user. To do this, you should use Telegram
API.

## Debugging application

As long as Web Apps are web applications, and they are opened in some native
components (not in browser), we are not allowed to debug them in common way as
we do it in browser applications until some additional actions are done.

To enable debug mode in native application follow
[official documentation](https://core.telegram.org/bots/webapps#debug-mode-for-web-apps)
.