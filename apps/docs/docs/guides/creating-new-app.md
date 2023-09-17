# Creating new app

In this article, we will delve into the process of developing a new application on the
Telegram Web Apps platform, we will find out exactly what actions need to be performed to create it,
as well as give advice on improving the process of creating an application.

The process of creating an application usually consists of the following basic steps:

1. Creating Telegram bot and registering TWA application.
2. Creating web application.
3. Getting web application URL and setting it in TWA settings.

## Before starting

Before creating a new TWA application, you need to remember an important rule:
_do not create entities related to development in the production environment_. Development
within the production environment is a sign of bad taste, so use it strictly if you can't avoid it.

To create an application we should use test environment. You can learn more about switch to
the test environment in [this](../test-environment.md) article.

Speaking of advantages a developer gets from the test environment, it is important to mention
an opportunity of usage of `http` links instead of `https`, as well as IPs directly. Production
environments allows usage only valid `https` links.

## Creating application in BotFather

As long as technically, TWA applications are connected with Telegram bots, we should firstly create
a Telegram bot. To do this, you need to find the father of all
bots, the bot [BotFather](https://t.me/botfather) and use the command
`/newbot`, then go through the proposed process, specifying all the necessary data.

When the bot is created, it is required then to use the command `/newapp` and again go
through the procedure of creating another entity - the Telegram Web Apps application,
linking it to the Telegram bot. From now on, the created application will
be available via a direct link of the form `https://t.me/{mybot}/{myapp}`.

## Web application link

:::info

Before reading this section, make sure that you have already created a frontend application
that can be accessed via a direct link.

:::

This step is mandatory in the process of creating a TWA application. Due to the fact
that TWA applications are web applications, the most common way
to get and display applications is to download them at some URL and
then render them.

As mentioned earlier, in the production environment, it is allowed to use
only links that have the `https` protocol with a valid SSL certificate. Otherwise, users' devices
will not be able to download the application. In the test environment, both `http` links and direct
IP addresses can be used.

Given the fact that links in the production environment and for development are different,
we will consider the process of obtaining them separately.

### For development

#### Ngrok

Many newcomers to development may often have a question about how
easy it is to get a temporary URL for development that works on the `https` protocol
and has a valid SSL certificate. The solution to this problem is quite simple and common, developers
can use such a service as [ngrok](https://ngrok.com/). It has low development limits and allows you
to create applications comfortably.

Imagine that the application being developed is currently running at
`localhost:3000'. Then in order to open a tunnel to this
application, you need to use the following command:

```bash title="Example of getting a link"
ngrok http 3000
```

:::caution

Do not use the provided ngrok link in the production environment.
Frontend applications should be a set of static files and be
uploaded to some hosting. The link to the application should not be
dynamic, since in this case it will have to be constantly changed in BotFather.

:::

#### Localtunnel

[Localtunnel](https://github.com/localtunnel/localtunnel ) is another similar technology that
provides a valid `https` link.

```bash title="Example of getting a link"
lt --port 3000 -s web-apps-test
# your url is: https://web-apps-test.loca.lt
```

:::caution

The main problem of this project is disabling the tunnel in case
the development server has been disabled.

:::

### For production

Getting a production link is also not difficult. To do this, you can use the popular free static
services:

- [GitHub Pages](https://pages.github.com/)
- [Heroku](https://www.heroku.com/)
- [Vercel](https://vercel.com/)

However, the developer can also use any other hosting. It is important to remember that the link to
the application must work on the `https` protocol and have a valid SSL certificate. To get a free
one, consider [certbot](https://cert bat.eff.org /).

### Applying link

When an https link is received, it must be used in a previously created Telegram bot. Telegram
supports several ways to install this link:

- **For the bot menu button**. Then every user who will enter a dialogue with the bot will be able
  to open its "menu" in the form of a developed application.
- **For TWA application**. Then the application will open only if the user
  follows the link in format `https://t.me/{mybot}/{myapp}`. In this case, user can avoid joining
  a dialogue with the bot.

#### Menu button

To set the link on the menu button, you need to go to the dialog with BotFather and use
the command (send a message) `/setmenubutton`. Next, BotFather will ask you to select a bot, specify
a link, as well as a title for the menu button.

As a result, when a user enters a chat with a bot, he will be able to open a web application by
clicking on the menu button on the bottom left in the interface.

#### Direct link

To install a direct link to the application, you must complete the following steps:

1. Send the BotFather command `/myapps`.
2. Select the required application.
3. Click `Edit link` and install a new link.

Now when the user clicks on the format link `https://t.me/{mybot}/{myapp}`, Telegram
will display the web component with the source address as the URL specified in the settings.

## Additional

### Hot Module Replacement

The application development process is a fairly complex and lengthy process.
You always want to see the changes you make in the code right away on the screen. In order
to see the changes in real time, it is necessary to use
such a technique as **Hot Module Replacement**. This section will not cover
the process of setting it up, as it often depends on the project, but well-known
frameworks already include this functionality by default.

How to configure HMR can be found
in [this Webpack article](https://webpack.js.org/guides/hot-module-replacement/).

[//]: # (## Заключение)

[//]: # ()

[//]: # (Этого вполне достаточно для того, чтобы создать свое первое приложение TWA.)

[//]: # (Тем не менее, данный гайд не покрывает все особенности платформы, а лишь)

[//]: # (помогает избежать бесполезной траты времени на базовые и простые проблемы.)

[//]: # (## Debugging application)

[//]: # ()

[//]: # (As long as Web Apps are web applications, and they are opened in some native)

[//]: # (components &#40;not in browser&#41;, we are not allowed to debug them in common way as)

[//]: # (we do it in browser applications until some additional actions are done.)

[//]: # ()

[//]: # (To enable debug mode in native application follow)

[//]: # ([official documentation]&#40;https://core.telegram.org/bots/webapps#debug-mode-for-web-apps&#41;)

[//]: # (.)