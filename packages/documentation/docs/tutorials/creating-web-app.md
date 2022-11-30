# Creating Web App

In this article we are going to go deep into creation process of new Web App. It
is assumed, that you already have experience in
creating new web applications with usage of some popular frontend libraries like
Angular, React, Vue etc. Nevertheless, it is not restricted to use vanilla JS.
Here is the
minimal [list of technologies](../introduction/required-technologies.md)
required for Web App development.

Creating Web App usually consists of these steps:

1. Create Telegram Bot
2. Create web application
3. Get web application https link
4. Assign link to Telegram Bot

## Creating Telegram bot

As long as Web Apps are just add-ons for Telegram Bots, obviously, firstly, we
should create Telegram Bot. To do so, we should
use [BotFather](https://t.me/botfather).

The next step is to send message, which will start procedure of creating new
bot - `/newbot`.

Father will ask questions about new bot information and
as a result, we will have newly created bot. The only 1 thing we need from it —
its secret key, which is used during init data signing and verification.

After bot is successfully created, we should go to the next step — get and apply
application https link which is used to show application. Despite the fact,
that according to introduction, the next step should be web application
creation, we will not be able to do it as long as we need to debug it at least.

So, before reading the next section, make sure you created standard web
application which allows its receiving via some http link.

## Getting and applying https link

This step is required in Web Apps development flow. The reason is Web Apps are
always presented as usual web applications and, as we know, default way of
getting web application is to get it by some URL.

Talking about Web Apps, it is required to have URL with `https` protocol only,
not http. BotFather will not allow us to pass link with `http` protocol because
it is not safe (and it will just not work in `https` environment). Additionally,
passed https link should have valid SSL-certificate. Otherwise, our application
will not be shown.

As long as production and development links are usually used for different
purposes, we will describe their getting flow separately.

### Development

#### Hot-reload

Application development is rather hard process which is usually observed in real
time by developer. It is common, that while developing application, we want to
see all changes directly on device.

To see all changes in real-time, it is required to use such functionality as
*hot reload*. In this section we will not describe what hot reload deeply is,
but in several words, it is just a technique which allows developers to reload
parts of the code in real-time and display result without pages reloads.

To develop with comfort, you will probably need to get it for your current
frontend architecture. Usually, all default templates for popular frontend
frameworks already include this feature and hot-reload configuration is not
required.

#### Ngrok

By default, developers have no easy way to get valid https link which will
redirect external client to our PC with specified port. To solve this problem,
we could use such service as [ngrok](https://ngrok.com/). It has enough low
restrictions to develop application with comfort.

Here comes an example of creating a tunnel to `localhost:3000`:

```bash
ngrok http 3000
```

Simple, isn't it?

:::caution

Do not use provided by ngrok link in production. Frontend application should be
placed on some hosting and downloaded as set of already prepared static assets.
See next section for more information.

:::

### Production

Getting production-ready URL is not that hard task. To get required link, it is
enough to use rather popular services, such as:

- [GitHub Pages](https://pages.github.com/)
- [Heroku](https://www.heroku.com/)
- [Vercel](https://vercel.com/)

In case, you don’t want to use public hosting, you could create your own server
which serves applications static files. But don’t forget that you still need
valid https link, what means, you should have your own DNS name and valid SSL
certificate. For this purpose, consider [certbot](https://certbot.eff.org/).

### Applying link

When https link is already received, it is required to set it in our Bot. To do
this, we should return to BotFather and send message `/setmenubutton`. Then,
BotFather will ask us to choose bot, link to apply and menu button title.

As a result, when user enters a chat with your bot, he will be able to open Web
App by clicking bottom left button (which is usually called `menu button`). It
is worth mentioning, that it is not the only one way of opening Web App. This
way of setting https link applies it for each Telegram user, but you are able to
pass specific link for any user. To do this, you should use Telegram API.

## Conclusion

This is fair enough to create Web App. Nevertheless, this tutorial does not
cover all platform features. It is recommended to dive deep into all aspects of
Web Apps via reading other documentation sections.

[//]: # (## Debugging application)

[//]: # ()

[//]: # (As long as Web Apps are web applications, and they are opened in some native)

[//]: # (components &#40;not in browser&#41;, we are not allowed to debug them in common way as)

[//]: # (we do it in browser applications until some additional actions are done.)

[//]: # ()

[//]: # (To enable debug mode in native application follow)

[//]: # ([official documentation]&#40;https://core.telegram.org/bots/webapps#debug-mode-for-web-apps&#41;)

[//]: # (.)