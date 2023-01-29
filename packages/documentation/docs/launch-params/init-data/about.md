---
sidebar_position: 1
---

# About

Init data is a rather important part of Telegram's platform. In simple terms,
init data is a set of properties, which contains useful information about the
current Web App launch. You could use this information to identify users on the
server side. Thanks to Telegram, it provides a special init data
signature [verification flow](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)
via pseudocode.

## Extraction

The easiest way to pass init data to the application and allow its usage while
executing javascript code is to specify it in the application URL. That's why
Telegram Web Apps uses this way. As long as init data is one of the launch
parameters, you could extract it this way:

```typescript
// Get "tgWebAppData" launch parameter.
const param = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');

// Convert it to more appropriate form.
const initData = new URLSearchParams(param);

// Get "hash" property.
console.log(initData.get('hash')); // 4975e881a0347264512f6047e1f3d698cbd2...
```

## Sending to server

One of the main features of init data is it could be used as an authorization
factor. It means you could use it to identify requesting clients. As long as
init data is always signed by Telegram bot secret token (sign is placed
in `hash` property), you could always verify it and trust its properties. The
best way to pass init data to your server is to specify it in some header. Here
comes the example in JavaScript with `axios` library usage:

```typescript
import axios from 'axios';

const initData = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');

if (initData === null) {
  throw new Error('Ooof! Something is wrong. Are we in Telegram?');
}

// Create axios instance.  
const http = axios.create({
  headers: {
    // Append authorization header. 
    Authorization: `Bearer ${initData}`,
  }
});

// Now, in case we use this instance to perform requests, 
// authorization header will be automatically appended. 
// The next thing we have to do is just verify it on server side.  
```

## Libraries and examples

Not to waste your time, you could use our libraries via different programming
languages:

- [TypeScript](https://github.com/Telegram-Web-Apps/twa/tree/master/packages/init-data)
  (NodeJS and browser)
- [GoLang](https://github.com/Telegram-Web-Apps/init-data-golang)
