import { defineConfig } from 'vitepress';

import { packagesNavItem, packagesSidebar } from './packages';
import { platformNavItem, platformSidebar } from './platform';

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
      // TODO: Probably replace with Algolia.
      provider: 'algolia',
      options: {
        apiKey: '2d6f370231694c71de2955f974e54986',
        appId: 'QRZA56E4H6',
        indexName: 'telegram-mini-apps',
        insights: true
      }
    },
  },
});
