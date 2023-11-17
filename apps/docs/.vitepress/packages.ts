function prefixed(value: string): string {
  return `/packages${value}`;
}

export const packagesNavItem = {
  text: 'Packages',
  link: prefixed('/typescript/tma-js-bridge'),
};

export const packagesSidebar = {
  [prefixed('/')]: [
    {
      text: 'TypeScript',
      items: [
        { text: '@tma.js/bridge', link: prefixed('/typescript/tma-js-bridge') },
        {
          text: '@tma.js/init-data',
          collapsed: true,
          items: [
            { text: 'About', link: prefixed('/typescript/tma-js-init-data/about') },
            { text: 'InitData', link: prefixed('/typescript/tma-js-init-data/init-data') },
            { text: 'Chat', link: prefixed('/typescript/tma-js-init-data/chat') },
            { text: 'User', link: prefixed('/typescript/tma-js-init-data/user') },
          ],
        },
        {
          text: '@tma.js/launch-params',
          link: prefixed('/typescript/tma-js-launch-params'),
        },
        { text: '@tma.js/theme-params', link: prefixed('/typescript/tma-js-theme-params') },
        { text: '@tma.js/navigation', link: prefixed('/typescript/tma-js-navigation') },
        {
          text: '@tma.js/sdk',
          collapsed: true,
          items: [
            { text: 'About', link: prefixed('/typescript/tma-js-sdk/about') },
            {
              text: 'Components',
              collapsed: true,
              items: [
                {
                  text: 'BackButton',
                  link: prefixed('/typescript/tma-js-sdk/components/back-button'),
                },
                {
                  text: 'ClosingBehavior',
                  link: prefixed('/typescript/tma-js-sdk/components/closing-behaviour'),
                },
                {
                  text: 'HapticFeedback',
                  link: prefixed('/typescript/tma-js-sdk/components/haptic-feedback'),
                },
                {
                  text: 'InitData',
                  link: prefixed('/typescript/tma-js-sdk/components/init-data'),
                },
                {
                  text: 'MainButton',
                  link: prefixed('/typescript/tma-js-sdk/components/main-button'),
                },
                {
                  text: 'Popup',
                  link: prefixed('/typescript/tma-js-sdk/components/popup'),
                },
                {
                  text: 'QRScanner',
                  link: prefixed('/typescript/tma-js-sdk/components/qr-scanner'),
                },
                {
                  text: 'ThemeParams',
                  link: prefixed('/typescript/tma-js-sdk/components/theme-params'),
                },
                {
                  text: 'Viewport',
                  link: prefixed('/typescript/tma-js-sdk/components/viewport'),
                },
                // TODO: Rename?
                {
                  text: 'WebApp',
                  link: prefixed('/typescript/tma-js-sdk/components/web-app'),
                },
              ],
            },
          ],
        },
        { text: '@tma.js/sdk-react', link: prefixed('/typescript/tma-js-sdk-react') },
        { text: '@tma.js/sdk-solid', link: prefixed('/typescript/tma-js-sdk-solid') },
      ],
    },
    {
      text: 'Node',
      items: [
        { text: '@tma.js/init-data-node', link: prefixed('/node/tma-js-init-data-node') },
      ],
    },
    {
      text: 'GoLang',
      items: [
        { text: 'init-data-golang', link: prefixed('/golang/init-data-golang') },
      ],
    },
  ],
};