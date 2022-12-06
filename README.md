# twa

Mono-repository, containing all the packages, connected with TypeScript
development on Web Apps platform. To learn more, follow packages own
documentations.

## Documentation

Before using packages in this repository, it is recommended to learn
how Telegram Web Apps platform works. You can find more information about
platform in our [documentation](https://telegram-web-apps.github.io/twa/).

## Packages

- [twa-core](packages/core) - core utilities reused all over the ecosystem
  libraries. You probably don't need to use this package directly, but it's
  surely useful to know how most of our libraries works.
- [twa-bridge](packages/bridge) - provides utilities to simplify communication
  flow between frontend and Telegram native applications. It also solves some
  across-platform data difference problems to protect developers code and save
  their time.
- [twa-theme-params](packages/theme-params) - provides developer
  information about which colors are currently used by native application and
  expects developer to use them.
- [twa-init-data](packages/init-data) - TypeScript isomorphic library to make work
  with Telegram Web Apps init data easier. Could be used both in browser and
  Node JS.
- [twa-sdk](packages/sdk) - Made from scratch TypeScript library for communication
  with Telegram Web Apps
  functionality.
- [twa-sdk-react](packages/sdk-react) - React bindings for Web Apps client SDK.
  Contains hooks, components and other useful tools which allow usage of React
  along with Web Apps client SDK.

## Contribution

Any contribution is appreciated. Feel free to create new feature requests, bug
reports etc.