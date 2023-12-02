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
        { text: 'About Platform', link: prefixed('/about-platform') },
        { text: 'Test Environment', link: prefixed('/test-environment') },
      ],
    },

    {
      text: 'Apps communication',
      items: [
        { text: 'Flow Definition', link: prefixed('/apps-communication/flow-definition') },
        { text: 'Methods', link: prefixed('/apps-communication/methods') },
        { text: 'Events', link: prefixed('/apps-communication/events') },
      ],
    },

    {
      text: 'Launch parameters',
      items: [
        { text: 'Common Information', link: prefixed('/launch-parameters/common-information') },
        { text: 'Init Data', link: prefixed('/launch-parameters/init-data') },
      ],
    },

    {
      text: 'Functionality',
      items: [
        { text: 'Closing Behavior', link: prefixed('/functionality/closing-behavior') },
        { text: 'Haptic Feedback', link: prefixed('/functionality/haptic-feedback') },
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