// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const githubSvgHtml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
    <path fill="currentColor" fill-rule="evenodd" d="M12 .75C5.646.75.5 5.896.5 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547 4.543-1.524 7.835-5.837 7.835-10.911C23.5 5.896 18.354.75 12 .75Z" clip-rule="evenodd"/>
  </svg>
`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Telegram Web Apps documentation',
  tagline: 'Written by enthusiasts full documentation for Telegram Web ' +
    'Apps technology. Provides explanations, tutorials, examples, hints ' +
    'and much more',
  url: 'https://telegram-web-apps.github.io',
  baseUrl: '/twa/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'telegram-web-apps', // Usually your GitHub org/user name.
  projectName: 'twa', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages-docs',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {sidebarPath: require.resolve('./sidebars.js')},
        blog: false,
        theme: {customCss: require.resolve('./src/css/custom.scss')},
        gtag: {
          trackingID: 'G-56XMKLCYLQ',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  stylesheets: [
    // Google Fonts.
    {href: 'https://fonts.googleapis.com', rel: 'preconnect'},
    {
      href: 'https://fonts.gstatic.com',
      rel: 'preconnect',
      crossorigin: '',
    },
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {sidebar: {autoCollapseCategories: true}},
      navbar: {
        // title: 'Web Apps',
        // logo: {
        //   alt: 'Telegram logo',
        //   src: 'img/logo.png',
        // },
        items: [
          {to: '/docs/from-authors', label: 'Docs', position: 'left'},
          {
            href: 'https://github.com/Telegram-Web-Apps',
            // label: 'GitHub',
            position: 'right',
            className: 'navbar-github-logo',
            html: githubSvgHtml,
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: 'Made by Telegram Web Apps Enthusiasts @ 2023',
        links: [
          // {
          //   title: 'Docs',
          //   items: [
          //     {
          //       label: 'Tutorial',
          //       to: '/docs/intro',
          //     },
          //   ],
          // },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          // {
          //   title: 'More',
          //   items: [
          //     {
          //       label: 'Blog',
          //       to: '/blog',
          //     },
          //     {
          //       label: 'GitHub',
          //       href: 'https://github.com/Telegram-Web-Apps',
          //     },
          //   ],
          // },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  plugins: ['docusaurus-plugin-sass'],
};

module.exports = config;
