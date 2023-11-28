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
      provider: 'algolia',
      options: {
        apiKey: '2d6f370231694c71de2955f974e54986',
        appId: 'QRZA56E4H6',
        indexName: 'telegram-mini-apps',
        insights: true,
      },
    },
  },

  transformPageData(pageData, { siteConfig }) {
    const {
      frontmatter,
      filePath,
      title,
      description,
      lastUpdated,
    } = pageData;
    const {
      site: {
        title: siteTitle,
        base,
        lang,
      },
      sitemap: {
        hostname,
      },
    } = siteConfig;
    const isHome = frontmatter.layout === 'home';
    const siteBase = `${hostname}${base}`;
    frontmatter.head ??= [];

    const addOg = (prop: string, content: string) => frontmatter.head.push([
      'meta',
      { property: `og:${prop}`, content },
    ]);

    addOg('title', isHome ? siteTitle : `${title} | ${siteTitle}`);
    addOg('site_name', 'Telegram Mini Apps Platform Documentation');
    addOg('image', `${siteBase}thumbnail-1200x630.b47f7147927cc113522893dc23b7a33c.png`);
    addOg('image:width', '1200');
    addOg('image:height', '630');
    addOg('image:type', 'image/png');
    addOg('locale', lang.replace(/-/, '_'));

    // To make it correctly display in Telegram.
    addOg('twitter:card', 'summary_large_image');

    if (description) {
      addOg('description', description);
    }

    if (isHome) {
      addOg('url', siteBase);
      addOg('type', 'website');
    } else {
      addOg('url', `${siteBase}${filePath.replace(/\.md$/, '')}`);
      addOg('type', 'article');
      if (lastUpdated) {
        addOg('article:modified_time', new Date(lastUpdated).toISOString());
      }
    }
  },

  transformHtml(code) {
    return code.replace(/<html /, '<html prefix="og: http://ogp.me/ns#" ');
  },
});
