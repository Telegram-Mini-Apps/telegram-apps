---
outline: [2, 3]
---

# Getting App Link

As long as Mini Apps are typical web applications, all of them require having their own URL, which
could be used to retrieve the application content and display it. Telegram does not provide any
storage to place the developer's application, and it is the responsibility of a developer to create
storage for their application and obtain its URL.

Recall that Telegram accepts only those links that have a valid SSL certificate and use the HTTPS
protocol. Unlike the production environment, the [test environment](../test-environment.md) allows
using an IP directly, and this is the environment we will use in this article.

## Development Mode

The application development process is considered to be never-ending. Long-term applications always
need maintenance, and for this reason, it is considered appropriate to perfect the process by
lowering the threshold of entry, as well as the resulting cognitive load.

::: info

It is rather important to note that development links are not supposed to be used in production.
Production links should not be dynamic and have to reference some server providing the Mini App
content.

:::

The development link can be categorized into two types: local and remote.

### Local Development Link

A local link for development refers to a link that will only be available to the current device, as
well as to devices that are on the same network as the current device.

Popular builders such as [Vite](https://vitejs.dev/) and [Webpack](https://webpack.js.org/) provide
the ability to run a local server for development. Each allows you to run this server on a specified
domain, as well as access the current server and devices on the same network as the current server.

As a result, you will get an IP that could be used in BotFather and will be accessible by the
current device and all devices on the same network.

### Remote Development Link

A remote development link refers to a temporary link that can be used to gain access to a
development server, even for devices located in another network.

To create a link of this type, first of all, you need to start the local development server and
obtain an IP that can be used to access the application. For example, such an IP could
be `127.0.0.1:5432`. However, this IP will not allow devices on another network to access the
application.

To solve this problem, you need to create some kind of link that is a tunnel to the local IP. For
this purpose, we use third-party, conditionally free services such as [ngrok](https://ngrok.com/)
and [localtunnel](https://localtunnel.github.io/www/).

#### Ngrok

In order to start using ngrok, you need to go through the registration stage and then proceed to
the [settings](https://dashboard.ngrok.com/get-started/setup) stage.

Next, you need to create a tunnel to your development server. If the development server was started
at the address `http://localhost:5432` or `http://127.0.0.1:5432`, then the command to create a
tunnel will look like this:

```bash
ngrok http 5432
```

As a result, the package will return a link that can be used in BotFather. When users open the
Mini App, they will use this link, leading to a server for development.

::: tip

It should be noted that the returned link has the HTTPS protocol, which allows you to use it outside
the test environment as well.

:::

As you can notice, the returned link will change each time you run this command. This makes the
technology usage not as comfortable as it could be because you have to change the Mini App link each
time this URL changes.

In case you are subscribed to a paid plan, you are allowed to use a custom subdomain, which solves
the problem related to a dynamic URL. To create such a type of link, you should use the following
command:

```bash
ngrok http --subdomain mysubdomain 5432
```

In this case you will receive the following link:

```
https://mysubdomain.ngrok.io
```

#### Localtunnel

Unlike ngrok, localtunnel is a completely free alternative that provides even the paid functionality
we need from ngrok.

As you can imagine, for this reason, localtunnel may be a more popular technology with fewer
resources. This may lead to its temporary inoperability.

To start using localtunnel, you need to install the appropriate package using npm:

```bash
npm install -g localtunnel
```

Next, use the command to create a tunnel:

```bash
lt -s mysubdomain --port 5432
```

The technology will return the following URL:

```
https://mysubdomain.loca.lt
```

## Production Mode

Getting a production link is also not difficult. To do this, you can use the popular free static
services:

- [GitHub Pages](https://pages.github.com/)
- [Heroku](https://www.heroku.com/)
- [Vercel](https://vercel.com/)

However, the developer can also use any other hosting. It is important to remember that the link to
the application must work on the HTTPS protocol and have a valid SSL certificate. To get a free
one, consider using [certbot](https://certbot.eff.org/pages/about).
