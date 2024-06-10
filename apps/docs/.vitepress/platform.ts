import { sectionGen } from './utils';

const PREFIX = '/platform';

const section = sectionGen(PREFIX);

export const platformNavItem = {
  text: 'Platform',
  link: `${PREFIX}/about`,
};

export const platformSidebar = {
  [PREFIX]: [
    section('Introduction', {
      'About Platform': 'about',
    }),
    section('Functional Features', {
      'Closing Behavior': 'closing-behavior',
      'Haptic Feedback': 'haptic-feedback',
    }),
    section('Apps Communication', {
      'Flow Definition': 'apps-communication',
      'Methods': 'methods',
      'Events': 'events',
    }),
    section('Launch Parameters', {
      'About': 'launch-parameters',
      'Start Parameter': 'start-parameter',
      'Init Data': 'init-data',
    }),
    section('Development', {
      'Debugging': 'debugging',
      'Test Environment': 'test-environment',
    }),
    section('UI', {
      'Back Button': 'back-button',
      'Main Button': 'main-button',
      'Popup': 'popup',
      'Settings Button': 'settings-button',
      'Theming': 'theming',
      'Viewport': 'viewport',
    }),
    section('Guides', {
      'Authorizing User': 'authorizing-user',
      'Creating New App': 'creating-new-app',
      'Getting App Link': 'getting-app-link',
      'Sticky App': 'sticky-app',
    }),
  ],
};