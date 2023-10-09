# Vanilla JS example

> ⚠️ Please, avoid using vanilla JavaScript if possible on Telegram Mini Apps
> platform. It is better to use ES modules at least. [Learn more](../../README.md#iife) 

Vanilla JavaScript SDK usage example.

## Trying it out

### Live

This example is already deployed and can be viewed right in Telegram, just follow
the [link](https://t.me/tmajsbot/vanilla_js_example).

### Locally

Install dependencies:

```bash
pnpm i
```

Serve `index.html`:

```bash
pnpm run serve
```

Run tunnel to locally launched HTTP server:

```bash
pnpm run tunnel
```

`tunnel` command will return a URL which has to be used by [@BotFather](https://t.me/botfather). Bind
it to your Mini App and open the application.