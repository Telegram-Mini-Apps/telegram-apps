---
outline: [ 2, 3 ]
---

# Getting App Link

As long as Mini Apps are typical web applications, all of them require having their own URL, which
could be used to retrieve the application content and display it. Telegram does not provide any
storage to place the developer's application, and it is the responsibility of a developer to create
storage for their application and obtain its URL.

Recall that Telegram accepts only those links that have a valid SSL certificate and use the HTTPS
protocol. Unlike the production environment, the [test environment](test-environment.md) allows
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

#### mkcert

[mkcert](https://github.com/FiloSottile/mkcert) is a tool, which allows developers to generate
SSL certificate along with the related private key. It also creates a Certificate Authority
which makes a local device trust the generated certificate.

Let's say, you would like to access the `tma.internal` domain as a development domain, it should
refer to the localhost. You should run the mkcert tool specifying this domain and receive 2 files:
SSL certificate and a private key. Then, both of this files should be used during
creation of a development server.

Here is the example of [Vite](https://vitejs.dev) development server configuration:

```typescript
import { defineConfig, type ServerOptions } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export default defineConfig(() => {
    const dir = dirname(fileURLToPath(import.meta.url));

    return {
        server: {
            port: 443,
            https: {
                // Certificate returned by mkcert.
                cert: readFileSync(resolve(dir, './tma.internal.cert.pem')),
                // Private key returned by mkcert.
                key: readFileSync(resolve(dir, './tma.internal.key.pem')),
            },
            host: 'tma.internal',
        }
    };
});
```

For the installation guide, refer to
the [official documentation](https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation).

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

In order to start using [ngrok](https://ngrok.com/), you need to go through the registration stage and then proceed to
the [settings page](https://dashboard.ngrok.com/get-started/setup).

Next, you need to create a tunnel to your development server. Each user has at least 1 free static domain,
which could be used in BotFather. To find your own, use this [link](https://dashboard.ngrok.com/cloud-edge/domains).

When a static domain was retrieved, create a tunnel using the command:

```bash
ngrok http --domain={YOUR_STATIC_DOMAIN} {YOU_DEV_SERVER_PORT}
```

So, if the static domain is `example.free.ngrok.app` and your dev server is
launched at `http://127.0.0.1:5432`, the command will be:

```bash
ngrok http --domain=example.free.ngrok.app 5432
```

After the tunnel is established, users opening the Mini App will be forwarded to your development
server.

#### Localtunnel

[Localtunnel](https://localtunnel.github.io/www/) is a completely free ngrok alternative. To start using localtunnel,
you need to install the according package using npm:

```bash
npm install -g localtunnel
```

Next, use the command to create a tunnel:

```bash
lt -s mysubdomain --port 5432
```

The package will return the following URL which could be used in BotFather:

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
