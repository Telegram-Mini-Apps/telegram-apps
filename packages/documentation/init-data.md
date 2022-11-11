# Init data

Telegram Web Apps init data is rather important part of Telegram`s platform.
This repository contains its explanation and verification examples and libraries
via different programming languages. You can find official verification example
via pseudocode in Web
Apps [documentation](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)
.

## Table of contents

- [Core information](#core-information)
- [Extraction](#extraction)
- [Sending to server](#sending-to-server)
- [Libraries](#libraries)

## Core information

Launching an application on Telegram Web Apps platform implies passing special
parameters which are connected with current user.

According to Web Apps are usual web applications, and they should be correctly
displayed on any device, they are always wrapped into WebView. So, native device
can communicate with our web application through WebView functionality.

## Extraction

The easiest way to pass init data to application and allow its usage while
executing javascript code is to mention it in application URL. That's why
Telegram Web Apps uses this way.

To make this part of working with init data easy, please, follow Client
SDK [documentation](https://github.com/Telegram-Web-Apps/twa/tree/master/packages/sdk)
. As a result, valid init data will be placed in `InitData` object:

```typescript
import {init} from 'twa-sdk';

init().then(({initData}) => console.log(initData));
```

## Sending to server

One of the main features of init data is it could be used as authorization
factor. It means, you could use it to identify requesting client.

As long as init data is always signed by Telegram bot secret token (sign is
placed in `hash` property), you could always verify it and trust its properties.

The best way to pass init data to your server is to specify it in some header.
Here comes an example in JavaScript with `axios` library usage:

```typescript
import axios from 'axios';

const initData = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');

if (initData === null) {
  throw new Error('Ooof! Something is wrong. Are we in Telegram wrapper?');
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
// The next thing we have to do is just verify 
// it on server side.  
```  

## Libraries

Here comes the recommended list of supported by community libraries on different
programming languages to work with Telegram's init data.

- [Golang](https://github.com/Telegram-Web-Apps/init-data-golang)
- [TypeScript](https://github.com/Telegram-Web-Apps/twa/tree/master/packages/init-data) (works in
  browser and Node)