import type { DefaultTheme } from 'vitepress';

import { sectionGen } from './utils';

type Sidebar = DefaultTheme.Sidebar;
type NavItemWithLink = DefaultTheme.NavItemWithLink;

function feature(prefix: string, path: string, title?: string): [string, string] {
  title ||=
    path[0].toUpperCase() +
    path.slice(1).replace(/-./g, (m) => ' ' + m[1].toUpperCase());

  return [`${prefix}${title}`, path];
}

function component(path: string, title?: string): [string, string] {
  return feature('💠', path, title);
}

function utils(path: string, title?: string): [string, string] {
  return feature('⚙️', path, title);
}

export const packagesLinksGenerator = (prefix: string = '') => {
  const BASE = prefix + '/packages';

  const section = sectionGen(BASE);

  const packagesNavItem: NavItemWithLink = {
    text: 'Packages',
    link: `${BASE}/telegram-apps-create-mini-app`,
  };

  const packagesSidebar: Sidebar = {
    [BASE]: [
      section('TypeScript', {
        '@tma.js/signals': 'tma-js-signals',
        '@tma.js/bridge': ['tma-js-bridge', {
          'Methods': 'methods',
          'Events': 'events',
          'Launch Parameters': 'launch-parameters',
          'Environment': 'environment',
          'Globals': 'globals',
          'Advanced': 'advanced',
          'Functional Approach': 'functional-approach',
          'Migrating from telegram-apps': 'migrate-from-telegram-apps',
        }],
        '@tma.js/sdk': ['tma-js-sdk', {
          'Initializing': 'initializing',
          'Usage Tips': 'usage-tips',
          'Features': ['features', {
            ...Object.fromEntries([
              component('back-button'),
              component('biometry'),
              component('closing-behavior'),
              component('cloud-storage'),
              utils('emoji-status'),
              component('haptic-feedback'),
              utils('home-screen'),
              component('init-data'),
              component('invoice'),
              utils('links'),
              component('location-manager'),
              component('main-button'),
              component('mini-app'),
              component('popup'),
              utils('privacy'),
              component('qr-scanner', 'QR Scanner'),
              component('secondary-button'),
              component('settings-button'),
              component('swipe-behavior'),
              component('theme-params'),
              utils('uncategorized'),
              component('viewport'),
            ]),
          }],
          'Migrating from telegram-apps': 'migrate-from-telegram-apps',
        }],
        '@tma.js/sdk-react': 'tma-js-sdk-react',
        '@tma.js/sdk-svelte': 'tma-js-sdk-svelte',
        '@tma.js/sdk-vue': 'tma-js-sdk-vue',
        '@tma.js/sdk-solid': 'tma-js-sdk-solid',
      }),
      section('Node', {
        '@tma.js/init-data-node': ['tma-js-init-data-node', {
          'Parsing': 'parsing',
          'Validating': 'validating',
          'Signing': 'signing',
          'Functional Approach': 'functional-approach',
          'Migrating from telegram-apps': 'migrate-from-telegram-apps',
        }],
      }),
      section('CLI', {
        '@tma.js/create-mini-app': 'tma-js-create-mini-app',
      }),
      section('GoLang', { 'init-data-golang': 'init-data-golang' }),
      section('CLI (docs to be removed in 2026)', {
        '@telegram-apps/create-mini-app': 'telegram-apps-create-mini-app',
        '@telegram-apps/mate': ['telegram-apps-mate', {
          'Hosting': 'hosting',
        }],
      }),
      section('TypeScript (deprecated, docs to be removed in 2026)', {
        '@telegram-apps/bridge': ['telegram-apps-bridge', {
          '@2.x': ['2-x', {
            'Methods': 'methods',
            'Events': 'events',
            'Launch Parameters': 'launch-parameters',
            'Environment': 'environment',
            'Globals': 'globals',
            'Advanced': 'advanced',
            'Migrate v1 -> v2': 'migrate-v1-v2',
          }],
          'Methods': 'methods',
          'Events': 'events',
          'Environment': 'environment',
          'Launch Parameters': 'launch-parameters',
          'Globals': 'globals',
        }],
        '@telegram-apps/signals': 'telegram-apps-signals',
        '@telegram-apps/sdk': [{ url: 'telegram-apps-sdk', page: false }, {
          '@1.x': ['1-x', {
            'Components': ['components', {
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
            }],
            'Environment': 'environment',
            'Methods and Events': 'methods-and-events',
            'Launch Parameters': 'launch-parameters',
            'Theme Parameters': 'theme-parameters',
            'Init Data': ['init-data', {
              InitData: 'init-data',
              Chat: 'chat',
              User: 'user',
            }],
            'Navigation': ['navigation', {
              BrowserNavigator: 'browser-navigator',
            }],
            'CSS Variables': 'css-variables',
          }],
          '@2.x': ['2-x', {
            'Initializing': 'initializing',
            'Scopes': 'scopes',
            'Usage Tips': 'usage-tips',
            'Components': [
              { url: 'components', page: false },
              Object.fromEntries([
                component('back-button'),
                component('biometry'),
                component('closing-behavior'),
                component('cloud-storage'),
                component('haptic-feedback'),
                component('init-data'),
                component('invoice'),
                component('main-button'),
                component('mini-app'),
                component('popup'),
                component('qr-scanner', 'QR Scanner'),
                component('secondary-button'),
                component('settings-button'),
                component('swipe-behavior'),
                component('theme-params'),
                component('viewport'),
              ]),
            ],
            'Utilities': [{ url: 'utils', page: false }, Object.fromEntries([
              component('emoji-status'),
              component('home-screen'),
              component('links'),
              component('privacy'),
              component('uncategorized'),
            ])],
          }],
          '@3.x': ['3-x', {
            'Initializing': 'initializing',
            'Scopes': 'scopes',
            'Usage Tips': 'usage-tips',
            'Components': [
              { url: 'components', page: false },
              Object.fromEntries([
                component('back-button'),
                component('biometry'),
                component('closing-behavior'),
                component('cloud-storage'),
                component('haptic-feedback'),
                component('init-data'),
                component('invoice'),
                component('location-manager'),
                component('main-button'),
                component('mini-app'),
                component('popup'),
                component('qr-scanner', 'QR Scanner'),
                component('secondary-button'),
                component('settings-button'),
                component('swipe-behavior'),
                component('theme-params'),
                component('viewport'),
              ]),
            ],
            'Utilities': [{ url: 'utils', page: false }, Object.fromEntries([
              component('emoji-status'),
              component('home-screen'),
              component('links'),
              component('privacy'),
              component('uncategorized'),
            ])],
            'Migrate v2 -> v3': 'migrate-v2-v3',
          }],
        }],
        '@telegram-apps/sdk-react': [{
          url: 'telegram-apps-sdk-react',
          page: false,
        }, {
          '@1.x': '1-x',
          '@2.x': '2-x',
          '@3.x': '3-x',
        }],
        '@telegram-apps/sdk-solid': [{
          url: 'telegram-apps-sdk-solid',
          page: false,
        }, {
          '@1.x': '1-x',
          '@2.x': '2-x',
          '@3.x': '3-x',
        }],
        '@telegram-apps/sdk-vue': [{ url: 'telegram-apps-sdk-vue' }, {
          '@2.x': '2-x',
        }],
        '@telegram-apps/sdk-svelte': [{ url: 'telegram-apps-sdk-svelte' }, {
          '@2.x': '2-x',
        }],
        '@telegram-apps/solid-router-integration': '/telegram-apps-solid-router-integration',
        '@telegram-apps/react-router-integration': '/telegram-apps-react-router-integration',
      }),
      section('Node (deprecated, docs to be removed in 2026)', {
        '@telegram-apps/init-data-node': [{ url: 'telegram-apps-init-data-node' }, {
          '@2.x': '2-x',
        }],
      }),
    ],
  };

  return {
    packagesNavItem,
    packagesSidebar,
  };
};
