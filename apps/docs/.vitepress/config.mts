import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Telegram Mini Apps',
  description: 'Documentation covering all aspects of Telegram platform - Telegram Mini Apps.',

  // Internationalization.
  // https://vitepress.dev/guide/i18n
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    // ru: {
    //   label: 'Русский',
    //   lang: 'ru',
    //   description: 'Документация, покрывающая все аспекты платформы Telegram - Telegram Mini Apps.',
    //   themeConfig: {
    //     editLink: {
    //       text: 'Редактировать эту страницу на GitHub',
    //       pattern: 'https://github.com/telegram-mini-apps/tma.js/edit/master/apps/docs/src/:path',
    //     },
    //   },
    // },
  },

  // Show when each page content was last updated.
  // https://vitepress.dev/reference/default-theme-last-updated#last-updated
  lastUpdated: true,

  // We don't want .html to be in the end of each route.
  // https://vitepress.dev/guide/routing#generating-clean-url
  cleanUrls: true,

  // Enable sitemap generation.
  // https://vitepress.dev/guide/sitemap-generation#sitemap-generation
  sitemap: {
    hostname: 'https://docs.telegram-mini-apps.com',
  },

  // Configure <head/>.
  // https://vitepress.dev/reference/site-config#head
  head: [
    // Add favicon.
    // https://vitepress.dev/reference/site-config#example-adding-a-favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.png',

    // https://vitepress.dev/reference/default-theme-footer#footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Vladislav Kibenko and Contributors',
    },

    editLink: {
      text: 'Edit this page on GitHub',
      pattern: 'https://github.com/telegram-mini-apps/tma.js/edit/master/apps/docs/src/:path',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/about-platform' },
    ],

    // https://vitepress.dev/reference/default-theme-sidebar
    sidebar: [
      {
        text: 'Common information',
        items: [
          { text: 'About platform', link: '/about-platform' },
          { text: 'Test environment', link: '/test-environment' },
        ],
      },

      {
        text: 'Apps communication',
        items: [
          { text: 'Flow definition', link: '/apps-communication/flow-definition' },
          { text: 'Methods', link: '/apps-communication/methods' },
          { text: 'Events', link: '/apps-communication/events' },
        ],
      },

      {
        text: 'Launch parameters',
        items: [
          { text: 'Common information', link: '/launch-parameters/common-information' },
          { text: 'Init data', link: '/launch-parameters/init-data' },
        ],
      },

      {
        text: 'Functionality',
        items: [
          { text: 'Closing behavior', link: '/functionality/closing-behavior' },
          { text: 'Haptic feedback', link: '/functionality/haptic-feedback' },
          { text: 'Theming', link: '/functionality/theming' },
          { text: 'Viewport', link: '/functionality/viewport' },
        ],
      },

      {
        text: 'UI',
        items: [
          { text: 'Back Button', link: '/ui/back-button' },
          { text: 'Main Button', link: '/ui/main-button' },
          { text: 'Popup', link: '/ui/popup' },
          { text: 'Settings Button', link: '/ui/settings-button' },
        ],
      },

      {
        text: 'Packages',
        items: [
          {
            text: 'TypeScript',
            collapsed: true,
            items: [
              { text: '@tma.js/bridge', link: '/packages/typescript/tma-js-bridge' },
              {
                text: '@tma.js/init-data',
                collapsed: true,
                items: [
                  { text: 'About', link: '/packages/typescript/tma-js-init-data/about' },
                  { text: 'InitData', link: '/packages/typescript/tma-js-init-data/init-data' },
                  { text: 'Chat', link: '/packages/typescript/tma-js-init-data/chat' },
                  { text: 'User', link: '/packages/typescript/tma-js-init-data/user' },
                ],
              },
              {
                text: '@tma.js/init-data-node',
                link: '/packages/typescript/tma-js-init-data-node',
              },
              { text: '@tma.js/launch-params', link: '/packages/typescript/tma-js-launch-params' },
              { text: '@tma.js/theme-params', link: '/packages/typescript/tma-js-theme-params' },
              { text: '@tma.js/navigation', link: '/packages/typescript/tma-js-navigation' },
              {
                text: '@tma.js/sdk',
                collapsed: true,
                items: [
                  { text: 'About', link: '/packages/typescript/tma-js-sdk/about' },
                  {
                    text: 'Components',
                    collapsed: true,
                    items: [
                      {
                        text: 'BackButton',
                        link: '/packages/typescript/tma-js-sdk/components/back-button',
                      },
                      {
                        text: 'ClosingBehavior',
                        link: '/packages/typescript/tma-js-sdk/components/closing-behaviour',
                      },
                      {
                        text: 'HapticFeedback',
                        link: '/packages/typescript/tma-js-sdk/components/haptic-feedback',
                      },
                      {
                        text: 'InitData',
                        link: '/packages/typescript/tma-js-sdk/components/init-data',
                      },
                      {
                        text: 'MainButton',
                        link: '/packages/typescript/tma-js-sdk/components/main-button',
                      },
                      {
                        text: 'Popup',
                        link: '/packages/typescript/tma-js-sdk/components/popup',
                      },
                      {
                        text: 'QRScanner',
                        link: '/packages/typescript/tma-js-sdk/components/qr-scanner',
                      },
                      {
                        text: 'ThemeParams',
                        link: '/packages/typescript/tma-js-sdk/components/theme-params',
                      },
                      {
                        text: 'Viewport',
                        link: '/packages/typescript/tma-js-sdk/components/viewport',
                      },
                      // TODO: Rename?
                      {
                        text: 'WebApp',
                        link: '/packages/typescript/tma-js-sdk/components/web-app',
                      },
                    ],
                  },
                ],
              },
              { text: '@tma.js/sdk-react', link: '/packages/typescript/tma-js-sdk-react' },
              { text: '@tma.js/sdk-solid', link: '/packages/typescript/tma-js-sdk-solid' },
            ],
          },
          {
            text: 'GoLang',
            collapsed: true,
            items: [
              { text: 'init-data-golang', link: '/packages/golang/init-data-golang' },
            ],
          },
        ],
      },

      {
        text: 'Guides',
        items: [
          { text: 'Creating new app', link: '/guides/creating-new-app' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/telegram-mini-apps' },
    ],

    search: {
      // TODO: Probably replace with Algolia.
      provider: 'local',
      // options: {
      //   locales: {
      //     ru: {
      //       translations: {
      //         button: {
      //           buttonText: 'Поиск',
      //           buttonAriaLabel: 'Поиск',
      //         },
      //         modal: {
      //           noResultsText: 'Не удалось ничего найти по запросу',
      //           backButtonTitle: 'закрыть',
      //           displayDetails: 'Отобразить подробные данные',
      //           resetButtonTitle: 'Сбросить',
      //           footer: {
      //             selectText: 'выбрать',
      //             navigateText: 'для навигации',
      //             closeText: 'закрыть',
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },
  },
});
