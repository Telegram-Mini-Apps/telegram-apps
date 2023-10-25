import {
  useMediaQuery
} from "./chunk-RCPMIN45.js";
import {
  computed,
  ref,
  watch
} from "./chunk-7OE2MXNA.js";

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/index.js
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/fonts.css";

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/without-fonts.js
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/vars.css";
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/base.css";
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/utils.css";
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/components/custom-block.css";
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code.css";
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/components/vp-code-group.css";
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/components/vp-doc.css";
import "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/styles/components/vp-sponsor.css";
import VPBadge from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue";
import Layout from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/Layout.vue";
import { default as default2 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPImage.vue";
import { default as default3 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPButton.vue";
import { default as default4 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue";
import { default as default5 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue";
import { default as default6 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue";
import { default as default7 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue";
import { default as default8 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue";
import { default as default9 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue";
import { default as default10 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue";
import { default as default11 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue";
import { default as default12 } from "D:/Projects/telegram-mini-apps/tma.js/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue";

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/shared.js
var inBrowser = typeof document !== "undefined";

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/support/utils.js
import { withBase } from "vitepress";

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/composables/data.js
import { useData as useData$ } from "vitepress";
var useData = useData$;

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/support/utils.js
function ensureStartingSlash(path) {
  return /^\//.test(path) ? path : `/${path}`;
}

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/support/sidebar.js
function getSidebar(_sidebar, path) {
  if (Array.isArray(_sidebar))
    return addBase(_sidebar);
  if (_sidebar == null)
    return [];
  path = ensureStartingSlash(path);
  const dir = Object.keys(_sidebar).sort((a, b) => {
    return b.split("/").length - a.split("/").length;
  }).find((dir2) => {
    return path.startsWith(ensureStartingSlash(dir2));
  });
  const sidebar = dir ? _sidebar[dir] : [];
  return Array.isArray(sidebar) ? addBase(sidebar) : addBase(sidebar.items, sidebar.base);
}
function getSidebarGroups(sidebar) {
  const groups = [];
  let lastGroupIndex = 0;
  for (const index in sidebar) {
    const item = sidebar[index];
    if (item.items) {
      lastGroupIndex = groups.push(item);
      continue;
    }
    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] });
    }
    groups[lastGroupIndex].items.push(item);
  }
  return groups;
}
function addBase(items, _base) {
  return [...items].map((_item) => {
    const item = { ..._item };
    const base = item.base || _base;
    if (base && item.link)
      item.link = base + item.link;
    if (item.items)
      item.items = addBase(item.items, base);
    return item;
  });
}

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/composables/sidebar.js
function useSidebar() {
  const { frontmatter, page, theme: theme2 } = useData();
  const is960 = useMediaQuery("(min-width: 960px)");
  const isOpen = ref(false);
  const _sidebar = computed(() => {
    const sidebarConfig = theme2.value.sidebar;
    const relativePath = page.value.relativePath;
    return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
  });
  const sidebar = ref(_sidebar.value);
  watch(_sidebar, (next, prev) => {
    if (JSON.stringify(next) !== JSON.stringify(prev))
      sidebar.value = _sidebar.value;
  });
  const hasSidebar = computed(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && frontmatter.value.layout !== "home";
  });
  const leftAside = computed(() => {
    if (hasAside)
      return frontmatter.value.aside == null ? theme2.value.aside === "left" : frontmatter.value.aside === "left";
    return false;
  });
  const hasAside = computed(() => {
    if (frontmatter.value.layout === "home")
      return false;
    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside;
    return theme2.value.aside !== false;
  });
  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value);
  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
  });
  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }
  function toggle() {
    isOpen.value ? close() : open();
  }
  return {
    isOpen,
    sidebar,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle
  };
}
var hashRef = ref(inBrowser ? location.hash : "");
if (inBrowser) {
  window.addEventListener("hashchange", () => {
    hashRef.value = location.hash;
  });
}

// ../../node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.4.7_search-insights@2.8.2_typescript@5.1.6/node_modules/vitepress/dist/client/theme-default/without-fonts.js
var theme = {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", VPBadge);
  }
};
var without_fonts_default = theme;
export {
  default3 as VPButton,
  default7 as VPDocAsideSponsors,
  default5 as VPHomeFeatures,
  default4 as VPHomeHero,
  default6 as VPHomeSponsors,
  default2 as VPImage,
  default8 as VPSponsors,
  default12 as VPTeamMembers,
  default9 as VPTeamPage,
  default11 as VPTeamPageSection,
  default10 as VPTeamPageTitle,
  without_fonts_default as default,
  useSidebar
};
//# sourceMappingURL=@theme_index.js.map
