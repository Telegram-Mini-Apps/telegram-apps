[code-badge]: https://img.shields.io/badge/source-black?logo=github

[docs-badge]: https://img.shields.io/badge/documentation-blue?logo=gitbook&logoColor=white

[react-badge]: https://img.shields.io/badge/React-244654?logo=react&logoColor=61DAFB

[solid-badge]: https://img.shields.io/badge/Solid-203A59?logo=solid&logoColor=38659F

[node-badge]: https://img.shields.io/badge/Node-1f491f?logo=node.js&logoColor=339933

# @twa.js

Mono-repository, containing all the packages, connected with comfortable and safe TypeScript
development on Telegram Mini Apps platform. To learn more, follow packages own documentations.

To learn more, visit platform [documentation](https://docs.twa.dev).

## Packages

### `@twa.js/bridge`

[bridge-code]: packages/bridge

[bridge-docs]: https://docs.twa.dev/docs/libraries/twa-js-bridge

[![docs-badge]][bridge-docs]
[![code-badge]][bridge-code]

Package which provides utilities to simplify communication flow between frontend and Telegram native
applications. It also solves some across-platform data difference problems to protect developers
code and save their time.

### `@twa.js/init-data`

[init-data-code]: packages/init-data

[init-data-docs]: https://docs.twa.dev/docs/libraries/twa-js-init-data

[![docs-badge]][init-data-docs]
[![code-badge]][init-data-code]

Package providing utilities connected with Telegram Mini Apps init data. It
allows init data validation and parse, works both in browser and NodeJS.

### `@twa.js/init-data-node` <sup>![node-badge]</sup>

[init-data-node-code]: packages/init-data-node

[init-data-node-docs]: https://docs.twa.dev/docs/libraries/twa-js-init-data-node

[![docs-badge]][init-data-node-docs]
[![code-badge]][init-data-node-code]

Package providing utilities connected with Telegram Mini Apps init data. It
allows init data validation and parse, works both in browser and NodeJS.

### `@twa.js/sdk`

[sdk-code]: packages/sdk

[sdk-docs]: https://docs.twa.dev/docs/libraries/twa-js-sdk

[![docs-badge]][sdk-docs]
[![code-badge]][sdk-code]

Made from scratch production-ready TypeScript Telegram Mini Apps Source Development Kit. It includes
all features provided by other packages extending them with intuitively clear functionality.

### `@twa.js/sdk-react` <sup>![react-badge]</sup>

[sdk-react-code]: packages/sdk-react

[sdk-react-docs]: https://docs.twa.dev/docs/libraries/twa-js-sdk-react

[![docs-badge]][sdk-react-docs]
[![code-badge]][sdk-react-code]

React bindings for client SDK. Contains hooks, components and other
useful tools which allow usage of React along with Web Apps client SDK.
Tracks SDK components changes out of box.

### `@twa.js/sdk-solid` <sup>![solid-badge]</sup>

[sdk-solid-code]: packages/sdk-solid

[sdk-solid-docs]: https://docs.twa.dev/docs/libraries/twa-js-sdk-solid

[![docs-badge]][sdk-react-docs]
[![code-badge]][sdk-react-code]

Solid JS bindings for client SDK. Provides signals, hooks and components to be used in Solid JS
application.