import type { DefaultTheme } from 'vitepress';

type SidebarItem = DefaultTheme.SidebarItem;

interface Items {
  [Title: string]: string | Items | [
    itemUrlOrOptions: string | {
      /**
       * Item own URL. If `page` is false, the value will be used as items' link prefix.
       */
      url?: string;
      /**
       * Custom title for this item.
       */
      title?: string;
      /**
       * True, if this item has its own documentation page.
       */
      page?: boolean
    },
    items: Items,
  ];
}

/**
 * Converts locally determined items to items, accepted by VitePress.
 * @param items - local items.
 * @param base - links' base.
 */
function itemsToConfigItems(items: Items, base: string): SidebarItem[] {
  const result: SidebarItem[] = [];

  for (let title in items) {
    let link: string | undefined;
    let linkItems: Items;
    let hasOwnPage: boolean | undefined;

    const tupleOrLinkOrItems = items[title];
    if (typeof tupleOrLinkOrItems === 'string') {
      // Item own link is specified.
      [link, linkItems, hasOwnPage] = [tupleOrLinkOrItems, {}, true];
    } else if (Array.isArray(tupleOrLinkOrItems)) {
      // Item options and subitems specified.
      const [linkOrOptions] = tupleOrLinkOrItems;
      if (typeof linkOrOptions === 'string') {
        link = linkOrOptions;
        hasOwnPage = true;
      } else {
        linkOrOptions.title && (title = linkOrOptions.title);
        link = linkOrOptions.url;
        hasOwnPage = typeof linkOrOptions.page === 'undefined'
          ? true
          : linkOrOptions.page;
      }
      linkItems = tupleOrLinkOrItems[1];
    } else {
      // Only subitems specified.
      linkItems = tupleOrLinkOrItems;
    }

    link = link ? `${base}/${link}` : undefined;
    result.push({
      text: title,
      link: hasOwnPage ? link : undefined,
      items: itemsToConfigItems(linkItems, link || base),
      collapsed: true,
    });
  }

  return result;
}

/**
 * Creates a new config item generator.
 * @param base - items' link base.
 */
export function sectionGen(base: string) {
  return (title: string, items: Items): SidebarItem => ({
    text: title,
    items: itemsToConfigItems(items, base),
  });
}