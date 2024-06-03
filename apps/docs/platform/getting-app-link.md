---
outline: [ 2, 4 ]
---

# Getting App Link

In a nutshell, all Mini Apps are typical web applications, all of them require having their own URL,
which could be used to retrieve the application content and display it. Telegram does not provide
any storage to place the developer's application, and it is the responsibility of a developer to
create storage for their application and obtain its URL.

Recall that Telegram accepts only those links that have a valid SSL certificate and use the HTTPS
protocol. Unlike the production environment, the [test environment](test-environment.md) allows
using an IP directly, and this is the environment we will use in this article.

::: info

Despite the fact, that we can use the test environment to develop our applications, most
of the time the environment doesn't show good performance. In case of encountering
test environment low performance issues, consider switching to production environment.

:::

## Introduction

Before you dive into this guide, it is important to understand, why you need some link. Most of
the time, we need application links for one of the following purposes:

1. **For development**. These links are temporary and used only to display an application via
   development server. It can also be used to share with some other users to show current progress.
2. **For production**. We use such types of links in production mode. These links are opening
   a production-ready application and usually used by common users.

This guide covers both of the cases. You can find real links generation and usage in the
[template for React.js](https://github.com/telegram-mini-apps/reactjs-template).

The next sections of this documentation will use [Vite](https://vitejs.dev) as the basic bundler
we use for the applications.

## For Development

The application development process is considered to be never-ending. Long-term applications always
need maintenance, and for this reason, it is considered appropriate to perfect the process by
lowering the threshold of entry, as well as the resulting cognitive load.

Development links are those, we use to view the application in the current development state.
The development link can be categorized into two types: local and remote. Let's take a look at them
closer.

::: warning

Development links are not supposed to be used in production. Production links should not be dynamic
and have to reference some server providing the Mini App content.

:::

### Local

A local link for development refers to a link that will only be available to the current device.

Popular bundler such as [Vite](https://vitejs.dev/) provides the ability to run a local server for
development. As a result, you will get an IP that can be used in BotFather or directly opened in
your browser.

Here is the basic Vite config, running development server and returning a link for development.

```ts
import { defineConfig } from 'vite';

export default defineConfig();
```

And a message in the console you will see:

```bash
VITE ready in 112 ms

➜  Local:   http://localhost:5173
➜  press h + enter to show help
```

Now, you are free to open the `Local` link (`http://localhost:5173`) in your browser and see the
application.

As you may have noticed, this link is not compatible with BotFather's requirements as long as
it must have the HTTPS protocol. Now, let's get an HTTPS link.

#### Vite Plugin

Vite's ecosystem provides
the [@vitejs/plugin-basic-ssl](https://www.npmjs.com/package/@vitejs/plugin-basic-ssl) plugin.
It allows launching the application with self-signed SSL certificates on a specified domain.

Here is the basic example:

```ts
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl(),
  ],
});
```

There are some additional options you may find useful. To learn more about them, follow plugin's
[docs](https://www.npmjs.com/package/@vitejs/plugin-basic-ssl).

After launching the development server, you will see a similar message:

```bash
VITE ready in 275 ms

➜  Local:   https://localhost:5173
➜  press h + enter to show help
```

The `Local` link (`https://localhost:5173`) refers to a local development server.
Opening this link in your browser, Telegram for macOS, Telegram Desktop, Telegram Web A/K, will lead
to showing a warning message related to untrusted certificate.

<img
src='/untrusted-cert-warning.png'
width='100%'
style='border: 1px solid #ebebeb; border-radius: 10px'
/>

Just make an exception for this and proceed to the application.

#### mkcert

[mkcert](https://github.com/FiloSottile/mkcert) is a tool, which allows developers to generate
SSL certificate along with the related private key. It also creates a Certificate Authority
which makes a local device trust the generated certificate. Here is the
[installation guide](https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation).

Let's say, you would like to create some custom domain, known only to your device, which
will be used only for development purposes. Let it be something like `tma.internal`. To
let your current device know which IP is associated with this domain, we should modify the
[hosts](https://en.wikipedia.org/wiki/Hosts_(file)) file and map `tma.internal` to `127.0.0.1`

Then, you should run the mkcert tool specifying this domain and receive 2 files: SSL certificate and
a private key. Both of these files should be specified in Vite config.

Here is the example of Vite development server configuration using entities, generated by mkcert:

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export default defineConfig(() => {
  return {
    server: {
      host: 'tma.internal',
      https: {
        cert: readFileSync(resolve('tma.internal.pem')),
        key: readFileSync(resolve('tma.internal-key.pem')),
      },
    }
  };
});
```

### Network

There could be some cases, when developer needs to open the application on different devices. We
implement such a feature using
Vite's [host](https://vitejs.dev/config/server-options.html#server-host) option.

Let's see how the corresponding config looks like:

```typescript
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    server: {
      host: true,
    }
  };
});
```

Alternatively, we could use such a command: `vite --host`.

After launching the development server, you will see a similar message in your console:

```bash
  VITE v5.2.12  ready in 15 ms

  ➜  Local:   http://localhost:5173
  ➜  Network: http://172.20.10.8:5173
  ➜  press h + enter to show help
```

Now you can access the `Network` link (`http://172.20.10.8:5173`) on the devices in the same
network.

To get an HTTPS link, refer to the previous sections of this guide.

### Remote

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

In order to start using [ngrok](https://ngrok.com/), you need to go through the registration stage
and then proceed to
the [settings page](https://dashboard.ngrok.com/get-started/setup).

Next, you need to create a tunnel to your development server. Each user has at least 1 free static
domain, which could be used in BotFather. To find your own, use
this [link](https://dashboard.ngrok.com/cloud-edge/domains).

When a static domain was retrieved, create a tunnel using the command:

```bash
ngrok http --domain={YOUR_STATIC_DOMAIN} {YOU_DEV_SERVER_PORT}
```

So, if the static domain is `example.free.ngrok.app` and your dev server is launched
at `http://127.0.0.1:5432`, the command will be:

```bash
ngrok http --domain=example.free.ngrok.app 5432
```

After the tunnel is established, users opening the Mini App will be forwarded to your development
server.

#### Localtunnel

[Localtunnel](https://localtunnel.github.io/www/) is a completely free ngrok alternative. To start
using localtunnel, you need to install the according package using npm:

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

## For Production

Getting a production link is also not difficult at all. To do this, you can use the popular free
static services:

- [GitHub Pages](https://pages.github.com/)
- [Heroku](https://www.heroku.com/)
- [Vercel](https://vercel.com/)

However, the developer can also use any other hosting. It is important to remember that the link to
the application must work on the HTTPS protocol and have a valid SSL certificate. To get a free
one, consider using [certbot](https://certbot.eff.org/pages/about).
