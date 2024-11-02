import { defineConfig } from "vitepress";

import { packagesLinksGenerator } from './packages';
import { platformLinksGenerator } from './platform';

const LANG_PREFIX = "/zh";

const { packagesNavItem, packagesSidebar } = packagesLinksGenerator(LANG_PREFIX);
const { platformNavItem, platformSidebar } = platformLinksGenerator(LANG_PREFIX);

function withSlashes(value: string | undefined): string {
  if (!value) {
    return '/';
  }
  if (!value.startsWith('/')) {
    value = '/' + value;
  }
  if (!value.endsWith('/')) {
    value += '/';
  }
  return value;
}

export const zh = defineConfig({
  lang: "zh-Hans",
  title: 'Telegram Mini Apps',
  description: 'Documentation covering all aspects of Telegram platform - Telegram Mini Apps.',

  // The base URL the site will be deployed at.
  // https://vitepress.dev/reference/site-config#base
  base: withSlashes(process.env.DOCS_BASE_URL),

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
    // Add Mixpanel analytics:
    // https://docs.mixpanel.com/docs/quickstart/connect-your-data?sdk=javascript
    ['script', { async: '', src: '/analytics.js' }],
  ],

  themeConfig: {
    logo: '/logo.db0268ac.png',

    // https://vitepress.dev/reference/default-theme-footer#footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Vladislav Kibenko and Contributors',
    },

    editLink: {
      text: '在 GitHub 上编辑此页面',
      pattern: 'https://github.com/telegram-mini-apps/telegram-apps/edit/master/apps/docs/:path',
    },

    nav: [
      { text: "主页", link: LANG_PREFIX },
      platformNavItem,
      packagesNavItem,
    ],

    // https://vitepress.dev/reference/default-theme-sidebar
    sidebar: {
      ...packagesSidebar,
      ...platformSidebar,
    },

    socialLinks: [{
      icon: 'github',
      link: 'https://github.com/telegram-mini-apps',
    }],

    search: {
      provider: 'local',
    },
  },
});