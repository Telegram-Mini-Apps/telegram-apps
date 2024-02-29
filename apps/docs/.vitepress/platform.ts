function prefixed(value: string): string {
  return `/platform${value}`;
}

export const platformNavItem = {
  text: 'Platform',
  link: prefixed('/about'),
};

export const platformSidebar = {
  [prefixed('/')]: [
    {
      text: 'Introduction',
      items: [
        { text: 'About Platform', link: prefixed('/about') },
      ],
    },

    {
      text: 'Functional Features',
      items: [
        { text: 'Closing Behavior', link: prefixed('/closing-behavior') },
        { text: 'Haptic Feedback', link: prefixed('/haptic-feedback') },
      ],
    },

    {
      text: 'Apps Communication',
      items: [
        { text: 'Flow Definition', link: prefixed('/apps-communication') },
        { text: 'Methods', link: prefixed('/methods') },
        { text: 'Events', link: prefixed('/events') },
      ],
    },

    {
      text: 'Launch Parameters',
      items: [
        { text: 'About', link: prefixed('/launch-parameters') },
        { text: 'Start Parameter', link: prefixed('/start-parameter') },
        { text: 'Init Data', link: prefixed('/init-data') },
      ],
    },

    {
      text: 'Development',
      items: [
        { text: 'Debugging', link: prefixed('/debugging') },
        { text: 'Test Environment', link: prefixed('/test-environment') },
      ],
    },

    {
      text: 'UI',
      items: [
        { text: 'Back Button', link: prefixed('/back-button') },
        { text: 'Main Button', link: prefixed('/main-button') },
        { text: 'Popup', link: prefixed('/popup') },
        { text: 'Settings Button', link: prefixed('/settings-button') },
        { text: 'Theming', link: prefixed('/theming') },
        { text: 'Viewport', link: prefixed('/viewport') },
      ],
    },

    {
      text: 'Guides',
      items: [
        { text: 'Creating New App', link: prefixed('/creating-new-app') },
        { text: 'Getting App Link', link: prefixed('/getting-app-link') },
      ],
    },
  ],
};