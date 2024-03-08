function prefixed(value: string): string {
  return `/packages${value}`;
}

export const packagesNavItem = {
  text: 'Packages',
  link: prefixed('/tma-js-sdk'),
};

export const packagesSidebar = {
  [prefixed('/')]: [
    {
      text: 'CLI',
      items: [
        { text: '@tma.js/create-mini-app', link: prefixed('/tma-js-create-mini-app') },
      ]
    },

    {
      text: 'TypeScript',
      items: [
        {
          text: '@tma.js/sdk',
          link: prefixed('/tma-js-sdk'),
          items: [
            {
              text: 'Initialization',
              link: prefixed('/tma-js-sdk/init'),
            },
            {
              text: 'Methods and events',
              link: prefixed('/tma-js-sdk/methods-and-events'),
            },
            {
              text: 'Launch parameters',
              link: prefixed('/tma-js-sdk/launch-parameters'),
            },
            {
              text: 'Theme parameters',
              link: prefixed('/tma-js-sdk/theme-parameters'),
            },
            {
              text: 'Init data',
              link: prefixed('/tma-js-sdk/init-data'),
              collapsed: true,
              items: [
                {
                  text: 'InitData',
                  link: prefixed('/tma-js-sdk/init-data/init-data'),
                },
                {
                  text: 'Chat',
                  link: prefixed('/tma-js-sdk/init-data/chat'),
                },
                {
                  text: 'User',
                  link: prefixed('/tma-js-sdk/init-data/user'),
                },
              ],
            },
            {
              text: 'Navigation',
              link: prefixed('/tma-js-sdk/navigation'),
            },
            {
              text: 'Components',
              collapsed: true,
              link: prefixed('/tma-js-sdk/components'),
              items: [
                {
                  text: 'BackButton',
                  link: prefixed('/tma-js-sdk/components/back-button'),
                },
                {
                  text: 'ClosingBehavior',
                  link: prefixed('/tma-js-sdk/components/closing-behavior'),
                },
                {
                  text: 'CloudStorage',
                  link: prefixed('/tma-js-sdk/components/cloud-storage'),
                },
                {
                  text: 'HapticFeedback',
                  link: prefixed('/tma-js-sdk/components/haptic-feedback'),
                },
                {
                  text: 'InitData',
                  link: prefixed('/tma-js-sdk/components/init-data'),
                },
                {
                  text: 'Invoice',
                  link: prefixed('/tma-js-sdk/components/invoice'),
                },
                {
                  text: 'MainButton',
                  link: prefixed('/tma-js-sdk/components/main-button'),
                },
                {
                  text: 'MiniApp',
                  link: prefixed('/tma-js-sdk/components/mini-app'),
                },
                {
                  text: 'Popup',
                  link: prefixed('/tma-js-sdk/components/popup'),
                },
                {
                  text: 'QRScanner',
                  link: prefixed('/tma-js-sdk/components/qr-scanner'),
                },
                {
                  text: 'SettingsButton',
                  link: prefixed('/tma-js-sdk/components/settings-button'),
                },
                {
                  text: 'ThemeParams',
                  link: prefixed('/tma-js-sdk/components/theme-params'),
                },
                {
                  text: 'Utils',
                  link: prefixed('/tma-js-sdk/components/utils'),
                },
                {
                  text: 'Viewport',
                  link: prefixed('/tma-js-sdk/components/viewport'),
                },
              ],
            },
          ],
        },
        { text: '@tma.js/sdk-react', link: prefixed('/tma-js-sdk-react') },
        { text: '@tma.js/sdk-solid', link: prefixed('/tma-js-sdk-solid') },
        {
          text: '@tma.js/solid-router-integration',
          link: prefixed('/tma-js-solid-router-integration'),
        },
      ],
    },

    {
      text: 'Node',
      items: [
        { text: '@tma.js/init-data-node', link: prefixed('/tma-js-init-data-node') },
      ],
    },

    {
      text: 'GoLang',
      items: [
        { text: 'init-data-golang', link: prefixed('/init-data-golang') },
      ],
    },
  ],
};