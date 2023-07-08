# @twa.js

Mono-repository, containing all the packages, connected with comfortable and
safe TypeScript development on Telegram Web Apps platform. To learn more,
follow packages own documentations.

## Before start

Before using packages in this repository, it is recommended to learn
how Telegram Web Apps platform works. You can find more information about
platform in this [documentation](https://docs.twa.dev).

## Packages

### [@twa.js/sdk-react](packages/sdk-react)

[sdk-react-npm-badge]: https://img.shields.io/npm/v/@twa.js/sdk-react.svg

[sdk-react-npm-link]: https://npmjs.com/package/@twa.js/sdk-react

[sdk-react-size-badge]: https://img.shields.io/bundlephobia/minzip/@twa.js/sdk-react

[![NPM][sdk-react-npm-badge]][sdk-react-npm-link]
![Size][sdk-react-size-badge]

React bindings for client SDK. Contains hooks, components and other
useful tools which allow usage of React along with Web Apps client SDK.
Tracks SDK components changes out of box.

### [@twa.js/sdk](packages/sdk)

[sdk-npm-badge]: https://img.shields.io/npm/v/@twa.js/sdk?logo=npm

[sdk-npm-link]: https://npmjs.com/package/@twa.js/sdk

[sdk-size-badge]: https://img.shields.io/bundlephobia/minzip/@twa.js/sdk

[![NPM][sdk-npm-badge]][sdk-npm-link]
![Size][sdk-size-badge]

Made from scratch production-ready TypeScript Telegram Web Apps
Source Development Kit. It includes all features provided
by other packages extending them with intuitively clear 
functionality.

### [@twa.js/bridge](packages/bridge)

[bridge-npm-badge]: https://img.shields.io/npm/v/@twa.js/bridge?logo=npm

[bridge-npm-link]: https://npmjs.com/package/@twa.js/bridge

[bridge-size-badge]: https://img.shields.io/bundlephobia/minzip/@twa.js/bridge

[![NPM][bridge-npm-badge]][bridge-npm-link]
![Size][bridge-size-badge]

Package which provides utilities to simplify communication flow between
frontend and Telegram native applications. It also solves some across-platform
data difference problems to protect developers code and save their time.

### [@twa.js/init-data](packages/init-data)

[init-data-npm-badge]: https://img.shields.io/npm/v/@twa.js/init-data?logo=npm

[init-data-npm-link]: https://npmjs.com/package/@twa.js/init-data

[init-data-size-badge]: https://img.shields.io/bundlephobia/minzip/@twa.js/init-data

[![NPM][init-data-npm-badge]][init-data-npm-link]
![Size][init-data-size-badge]

Package providing utilities connected with Telegram Web Apps init data. It
allows init data validation and parse, works both in browser and NodeJS.

### [@twa.js/utils](packages/utils)

[utils-npm-badge]: https://img.shields.io/npm/v/@twa.js/utils?logo=npm

[utils-npm-link]: https://npmjs.com/package/@twa.js/utils

[utils-size-badge]: https://img.shields.io/bundlephobia/minzip/@twa.js/utils

[![NPM][utils-npm-badge]][utils-npm-link]
![Size][utils-size-badge]

Tree-shakeable set of useful utilities used by many other libraries of
ecosystem. You probably don't need to install this package directly, but may
find provided functionality useful in other contexts.

## Contribution

Any contribution is appreciated. Feel free to create new feature requests, bug
reports etc.
