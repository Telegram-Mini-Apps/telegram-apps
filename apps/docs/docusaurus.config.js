// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Telegram Mini Apps documentation',
  tagline: 'Documentation by Telegram Web Apps enthusiasts covering all aspects of development on the platform. Provides lowest level information, guides and useful links.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://telegram-mini-apps.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'telegram-mini-apps',
  projectName: 'twa.js', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/telegram-mini-apps/twa.js/tree/master/',
        },
        blog: false,
      }),
    ],
  ],

  // stylesheets: [
  // { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
  // {
  //   href: 'https://fonts.gstatic.com',
  //   rel: 'preconnect',
  //   crossorigin: '',
  // },
  // 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
  // ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Telegram Mini Apps',
        items: [{
          type: 'doc',
          position: 'left',
          docId: 'introduction/about-platform',
          label: 'Docs',
        }, {
          type: 'localeDropdown',
          position: 'right',
        }, {
          href: 'https://github.com/twa-dev/docs',
          position: 'right',
          html: 'GitHub',
        }],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
