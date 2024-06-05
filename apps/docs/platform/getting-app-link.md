---
outline: [ 2, 4 ]
---

# Getting App Link

In a nutshell, all Mini Apps are typical web applications, each requiring its own URL, which is used
to retrieve and display the application's content. Telegram does not provide any storage for the
developer's application, so it is the developer's responsibility to create storage for their
application and obtain its URL.

Telegram accepts only links that have a valid SSL certificate and use the HTTPS protocol. Unlike the
production environment, the [test environment](test-environment.md) allows using an IP directly.

::: info

Despite the fact that we can use the test environment to develop our applications, the environment
often doesn't show good performance. If you encounter low performance issues in the test
environment, consider switching to the production environment.

:::

## Introduction

Before you dive into this guide, it is important to understand why you need some links. Most of the
time, we need application links for one of the following purposes:

1. **For development**: These links are temporary and used only to display an application via a
   development server. They can also be used to share with other users to show current progress.
2. **For production**: These links are used in production mode to open a production-ready
   application, typically accessed by common users.

This guide covers both cases. You can find real link generation and usage in
the [template for React.js](https://github.com/telegram-mini-apps/reactjs-template).

The next sections of this documentation will use [Vite](https://vitejs.dev) as the basic bundler for
the applications.

## For Development

The application development process is considered to be never-ending. Long-term applications always
need maintenance, and for this reason, it is appropriate to perfect the process by lowering the
threshold of entry and reducing the resulting cognitive load.

Development links are used to view the application in its current development state. These links can
be categorized into two types: local and remote. Let's take a closer look at them.

::: warning

Development links are not supposed to be used in production. Production links should not be dynamic
and must reference a server providing the Mini App content.

:::

### Local

A local link for development refers to a link that will only be available to the current device.

Popular bundlers such as [Vite](https://vitejs.dev/) provide the ability to run a local server for
development. As a result, you will get an IP that can be used in BotFather or directly opened in
your browser.

Here is the basic Vite config for running a development server and returning a link for development.

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

As you may have noticed, this link is not compatible with BotFather's requirements as it must use
the HTTPS protocol. Now, let's get an HTTPS link.

#### Vite Plugin

Vite's ecosystem provides
the [@vitejs/plugin-basic-ssl](https://www.npmjs.com/package/@vitejs/plugin-basic-ssl) plugin. It
allows launching the application with self-signed SSL certificates on a specified domain.

Here is a basic example:

```ts
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl(),
  ],
});
```

There are some additional options you may find useful. To learn more about them, follow the
plugin's [docs](https://www.npmjs.com/package/@vitejs/plugin-basic-ssl).

After launching the development server, you will see a similar message:

```bash
VITE ready in 275 ms

➜  Local:   https://localhost:5173
➜  press h + enter to show help
```

The `Local` link (`https://localhost:5173`) refers to a local development server. Opening this link
in your browser, Telegram for macOS, Telegram Desktop, or Telegram Web A/K will lead to a warning
message related to an untrusted certificate.

<img
   src="/untrusted-cert-warning.png"
   class="guides-image"
   style="border: 1px solid #ebebeb"
/>

Just make an exception for this and proceed to the application.

#### mkcert

[mkcert](https://github.com/FiloSottile/mkcert) is a tool that allows developers to generate SSL
certificates along with the related private key. It also creates a Certificate Authority which makes
the local device trust the generated certificate. Here is
the [installation guide](https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation).

Let's say you would like to create a custom domain, known only to your device, which will be used
only for development purposes. Let it be something like `tma.internal`. To let your current device
know which IP is associated with this domain, we should modify
the [hosts](https://en.wikipedia.org/wiki/Hosts_(file)) file and map `tma.internal` to `127.0.0.1`.

Then, you should run the mkcert tool specifying this domain and receive two files: an SSL
certificate and a private key. Both of these files should be specified in the Vite config.

Here is an example of Vite development server configuration using entities generated by mkcert:

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export default defineConfig({
  server: {
    host: 'tma.internal',
    https: {
      cert: readFileSync(resolve('tma.internal.pem')),
      key: readFileSync(resolve('tma.internal-key.pem')),
    },
  },
});
```

### Network

There could be cases when a developer needs to open the application on different devices. We
implement such a feature using
Vite's [host](https://vitejs.dev/config/server-options.html#server-host) option.

Let's see how the corresponding config looks:

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
  },
});
```

Alternatively, we could use the following command: `vite --host`.

After launching the development server, you will see a similar message in your console:

```bash
  VITE v5.2.12  ready in 15 ms

  ➜  Local:   http://localhost:5173
  ➜  Network: http://172.20.10.8:5173
  ➜  press h + enter to show help
```

Now you can access the `Network` link (`http://172.20.10.8:5173`) on devices in the same network.

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
