# Creating a Web App

In this article, we will go deep into a development process of a new Web
App. It is assumed, that you already have experience in creating new web
applications using some popular frontend libraries like Angular, React,
Vue, etc. Nevertheless, it is allowed to use vanilla JS. Here is a
minimal [list of technologies](../introduction/required-technologies.md)
required for a Web App development.

Creating a Web App usually consists of these steps:

1. Create a Telegram Bot;
2. Create a web application;
3. Get a web application link;
4. Assign the link to the Telegram Bot.

## Before starting 

Before creating a new Web App, we should learn one rule: _don't make anything 
related to a development in a production environment._ To create a new
application, we should use a test environment. This will make the development
process much easier and more correct. To learn how to switch to the test 
environment, read [this article](../test-environment.md).

In this case, an advantage we get from the test environment is an opportunity 
to use `http` links and even IPs directly. The production environment allows usage 
of only `https` links. 

## Creating a Telegram Bot

As long as Web Apps are just add-ons for the Telegram Bots, we should create a 
new bot. To do this, we use the [BotFather](https://t.me/botfather). Don't 
forget, that you should use an instance of this bot in the test environment, 
not in the production one.

To start a procedure of creating a new Telegram Bot, send a message 
with text `/newbot` to the BotFather. The BotFather will request an information 
about new bot and as a result, a new bot will be created. The only one thing we 
need from this procedure is the bot secret token. It is used during Web Apps 
[init data](../launch-params/init-data/about) validation.

After the bot is successfully created, we should go to the next step — get and 
apply an application link which is used to show an application. So, before 
reading the next section, make sure you created a standard web application 
which allows its receiving via some `http` link.

## Displaying the Web App

:::info

Before reading this section, it is required to create a standard web application
which allows users to receive it via some link. In a development mode, it could
be some temporary URL, in production - static URL.

:::

This step is required in the Web Apps development flow. The reason is Web Apps 
are always presented as usual web applications and, as we know, default way of
getting web application is to get them by some URL and render.

Talking about Web Apps, it is required to have URL with `https` protocol only. 
BotFather will not allow developer to pass a link with the `http` protocol because
it is not safe. Additionally, passed `https` link should have a valid 
SSL-certificate. Otherwise, the application will not be shown.

As long as production and development links are usually used for different
purposes, we will describe how to get them separately.

### Development

#### Hot-reload

An application development is rather hard process which is usually observed in 
real time by a developer. It is common, that while developing an application, 
we want to see all changes instantly on a device.

To see all changes in the real-time, it is required to use such functionality as
*hot reload*. In this section we will not describe what hot reload deeply is,
but in several words, it is just a technique which allows developers to reload
parts of the code in real-time and display result without page reload.

To develop with a comfort, you will probably need to get it for your current
frontend application. Usually, all default templates for popular frontend
frameworks already include this feature and a hot-reload configuration is not
required.

#### Ngrok

By default, developers have no easy way to get a valid https link which will
redirect external client to his application. To solve this problem,
he could use such service as [ngrok](https://ngrok.com/). It has enough low
restrictions to develop an application with comfort.

Here comes an example of creating a tunnel to `localhost:3000`:

```bash
ngrok http 3000
```

Simple, isn't it?

:::caution

Do not use provided by ngrok link in production. Frontend application should be
placed on some hosting and downloaded as set of already prepared static assets.
See the [Production](#production) section for more information.

:::

#### Localtunnel

[Localtunnel](https://github.com/localtunnel/localtunnel) is another one free 
technology which allows a developer to get `https` link. The one thing which 
differs localtunnel from ngrok is it allows reserving specified subdomain. 
For example, you could reserve subdomain `web-apps-test` via this command:

```bash
lt --port 3000 -s web-apps-test
# your url is: https://web-apps-test.loca.lt
```

:::caution

The main problem of this project is when developer stops an application that
locatunnel was referring to, tunnel stops working too.

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