import { sectionGen } from './utils';

const PREFIX = '/packages';

const section = sectionGen(PREFIX);

function scopeSection(path: string): [string, string] {
  return [
    path[0].toUpperCase() + path.slice(1).replace(/-./g, m => ' ' + m[1].toUpperCase()),
    path,
  ];
}

function fromEntries(entries: [string, any][]): Record<string, any> {
  const result = {};
  entries.forEach(([k, v]) => {
    result[k] = v;
  });

  return result;
}

export const packagesNavItem = {
  text: 'Packages',
  link: `${PREFIX}/telegram-apps-sdk`,
};

export const packagesSidebar = {
  [PREFIX]: [
    section('CLI', {
      '@telegram-apps/create-mini-app': 'telegram-apps-create-mini-app',
    }),
    section('TypeScript', {
      '@telegram-apps/sdk': [
        'telegram-apps-sdk',
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
              SwipeBehavior: 'swipe-behavior',
              ThemeParams: 'theme-params',
              Utils: 'utils',
              Viewport: 'viewport',
            },
            true,
          ],
          'Environment': 'environment',
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
      '@telegram-apps/sdk-react': '/telegram-apps-sdk-react',
      '@telegram-apps/sdk-solid': '/telegram-apps-sdk-solid',
      '@telegram-apps/solid-router-integration': '/telegram-apps-solid-router-integration',
      '@telegram-apps/react-router-integration': '/telegram-apps-react-router-integration',
    }),
    section('Node', {
      '@telegram-apps/init-data-node': 'telegram-apps-init-data-node',
    }),
    section('GoLang', {
      'init-data-golang': 'init-data-golang',
    }),
  ],
};
