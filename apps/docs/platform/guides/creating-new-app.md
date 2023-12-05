# Creating New App

In this article, we will delve into the process of developing a new application on the Telegram Mini
Apps platform, we will find out exactly what actions need to be performed to create it, as well as
give advice on improving the process of creating an application.

The process of creating an application usually consists of the following basic steps:

1. Creating Telegram bot and registering Mini App.
2. Creating web application.
3. Getting web application URL and setting it via BotFather.

## Before Starting

Before creating a new Mini App, you need to remember an important rule: _do not create
entities related to development in the production environment_. Development within the production
environment is a sign of bad taste, so use it strictly if you can't avoid it.

To create an application we should use test environment. You can learn more about switching to it
in [this](../test-environment.md) article.

Speaking of advantages a developer gets from the test environment, it is important to mention an
opportunity of usage of HTTP links instead of HTTPS, as well as IPs directly. Production
environment allows usage only valid HTTPS links.

## Creating Application in BotFather

As long as technically, Mini Apps are connected with Telegram bots, we should firstly create
a Telegram bot. To do this, you need to find the father of all bots, the
bot [BotFather](https://t.me/botfather) and use the command `/newbot`, then go through the proposed
process, specifying all the necessary data.

When the bot is created, it is required then to use the command `/newapp` and again go through the
procedure of creating another entity - the Telegram Mini Apps application, linking it to the
Telegram bot. From now on, the created application will be available via a direct link of the
form `https://t.me/{mybot}/{myapp}`.

::: info

Telegram Mini Apps technology can also be utilized without creating a new application but rather as
a web interface for a bot. To use it as an extension of the bot, use the
BotFather's `/setmenubutton` command.

:::

## Web Application Link

Before reading this section, make sure that you have already created a frontend application
that can be accessed via a direct link.

### Obtaining

To learn more about obtaining a link for your Mini App, refer to [this](getting-app-link.md)
article.

### Applying

When HTTPS link is received, it must be used in a previously created Telegram bot. Telegram
supports several ways to install this link:

- **For the bot menu button**. Then every user who will enter a dialogue with the bot will be able
  to open its "menu" in the form of a developed application.
- **For Telegram Mini Apps application**. Then the application will open only if the user
  follows the link in format `https://t.me/{mybot}/{myapp}`. In this case, user can avoid joining
  a dialogue with the bot.

#### Menu Button

To set the link on the menu button, you need to go to the dialog with BotFather and use
the command (send a message) `/setmenubutton`. Next, BotFather will ask you to select a bot, specify
a link, as well as a title for the menu button.

As a result, when a user enters a chat with a bot, he will be able to open a web application by
clicking on the menu button on the bottom left in the interface.

#### Direct Link

To install a direct link to the application, you must complete the following steps:

1. Send the BotFather command `/myapps`.
2. Select the required application.
3. Click `Edit link` and install a new link.

Now when the user clicks on a link in format `https://t.me/{mybot}/{myapp}`, Telegram
will display the web component with the source address as the URL specified in the settings.

[//]: # (## Additional)

[//]: # ()
[//]: # (### Hot Module Replacement)

[//]: # ()
[//]: # (The application development process is a fairly complex and lengthy process. You always want to see)

[//]: # (the changes you make in the code right away on the screen. In order to see the changes in real time,)

[//]: # (it is necessary to use such a technique as **Hot Module Replacement**. This section will not cover)

[//]: # (the process of setting it up, as it often depends on the project, but well-known frameworks already)

[//]: # (include this functionality by default.)

[//]: # ()
[//]: # (How to configure HMR can be found)

[//]: # (in [this Webpack article]&#40;https://webpack.js.org/guides/hot-module-replacement/&#41;.)

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