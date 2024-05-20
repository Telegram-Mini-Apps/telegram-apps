import { sectionGen } from './utils';

const PREFIX = '/packages';

const section = sectionGen(PREFIX);

export const packagesNavItem = {
  text: 'Packages',
  link: `${PREFIX}/tma-js-sdk`,
};

export const packagesSidebar = {
  [PREFIX]: [
    section('CLI', {
      '@tma.js/create-mini-app': 'tma-js-create-mini-app',
    }),
    section('TypeScript', {
      '@tma.js/sdk': [
        'tma-js-sdk',
        {
          'Components': [
            'components',
            {
              BackButton: 'back-button',
              BiometryManager: 'biometry-manager',
              ClosingBehavior: 'closing-behavior',
              CloudStorage: 'cloud-storage',
              HapticFeedback: 'haptic-feedback',
              InitData: 'init-data',
              Invoice: 'invoice',
              MainButton: 'main-button',
              MiniApp: 'mini-app',
              Popup: 'popup',
              QRScanner: 'qr-scanner',
              SettingsButton: 'settings-button',
              ThemeParams: 'theme-params',
              Utils: 'utils',
              Viewport: 'viewport',
            },
            true,
          ],
          'Methods and Events': 'methods-and-events',
          'Launch Parameters': 'launch-parameters',
          'Theme Parameters': 'theme-parameters',
          'Init Data': [
            'init-data',
            {
              InitData: 'init-data',
              Chat: 'chat',
              User: 'user',
            },
            true,
          ],
          'Navigation': [
            'navigation',
            {
              BrowserNavigator: 'browser-navigator',
            },
            true
          ],
          'CSS Variables': 'css-variables',
        },
      ],
      '@tma.js/sdk-react': '/tma-js-sdk-react',
      '@tma.js/sdk-solid': '/tma-js-sdk-solid',
      '@tma.js/solid-router-integration': '/tma-js-solid-router-integration',
      '@tma.js/react-router-integration': '/tma-js-react-router-integration',
    }),
    section('Node', {
      '@tma.js/init-data-node': 'tma-js-init-data-node',
    }),
    section('GoLang', {
      'init-data-golang': 'init-data-golang',
    }),
  ],
};
