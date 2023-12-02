function prefixed(value: string): string {
  return `/platform${value}`;
}

export const platformNavItem = {
  text: 'Platform',
  link: prefixed('/about-platform'),
};

export const platformSidebar = {
  [prefixed('/')]: [
    {
      text: 'Common information',
      items: [
        { text: 'About platform', link: prefixed('/about-platform') },
        { text: 'Test environment', link: prefixed('/test-environment') },
      ],
    },

    {
      text: 'Apps communication',
      items: [
        { text: 'Flow definition', link: prefixed('/apps-communication/flow-definition') },
        { text: 'Methods', link: prefixed('/apps-communication/methods') },
        { text: 'Events', link: prefixed('/apps-communication/events') },
      ],
    },

    {
      text: 'Launch parameters',
      items: [
        { text: 'Common information', link: prefixed('/launch-parameters/common-information') },
        { text: 'Init data', link: prefixed('/launch-parameters/init-data') },
      ],
    },

    {
      text: 'Functionality',
      items: [
        { text: 'Closing behavior', link: prefixed('/functionality/closing-behavior') },
        { text: 'Haptic feedback', link: prefixed('/functionality/haptic-feedback') },
        { text: 'Theming', link: prefixed('/functionality/theming') },
        { text: 'Viewport', link: prefixed('/functionality/viewport') },
      ],
    },

    {
      text: 'UI',
      items: [
        { text: 'Back Button', link: prefixed('/ui/back-button') },
        { text: 'Main Button', link: prefixed('/ui/main-button') },
        { text: 'Popup', link: prefixed('/ui/popup') },
        { text: 'Settings Button', link: prefixed('/ui/settings-button') },
      ],
    },

    {
      text: 'Guides',
      items: [
        { text: 'Creating New App', link: prefixed('/guides/creating-new-app') },
        { text: 'Getting App Link', link: prefixed('/guides/getting-app-link') },
      ],
    },
  ],
};