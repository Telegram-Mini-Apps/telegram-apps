interface Items {
  [Title: string]:
    | string
    | Items
    | [
    itemUrlOrOptions: string | {
      /**
       * Item own URL. If `page` is false, the value will be used as items' link prefix.
       */
      url: string;
      /**
       * True, if this item has its own documentation page.
       */
      page?: boolean
    },
    items: Items
  ];
}

interface ConfigItem {
  text: string;
  link?: string;
  items: ConfigItem[];
  collapsed?: boolean;
}

/**
 * Converts locally determined items to items, accepted by VitePress.
 * @param items - local items.
 * @param prefix - links' prefix.
 */
function itemsToConfigItems(items: Items, prefix: string): ConfigItem[] {
  const result: ConfigItem[] = [];

  for (const title in items) {
    let itemUrlEntry: string | undefined;
    let linkItems: Items;
    let hasOwnPage: boolean | undefined;

    const tupleOrLinkOrItems = items[title];
    if (typeof tupleOrLinkOrItems === 'string') {
      [itemUrlEntry, linkItems, hasOwnPage] = [tupleOrLinkOrItems, {}, true];
    } else if (Array.isArray(tupleOrLinkOrItems)) {
      const [itemUrlOrOptions] = tupleOrLinkOrItems;
      if (typeof itemUrlOrOptions === 'string') {
        itemUrlEntry = itemUrlOrOptions;
        hasOwnPage = true;
      } else {
        itemUrlEntry = itemUrlOrOptions.url;
        hasOwnPage = typeof itemUrlOrOptions.page === 'undefined'
          ? true
          : itemUrlOrOptions.page;
      }
      linkItems = tupleOrLinkOrItems[1];
    } else {
      linkItems = tupleOrLinkOrItems;
    }

    const link = itemUrlEntry ? `${prefix}/${itemUrlEntry}` : undefined;
    result.push({
      text: title,
      link: hasOwnPage ? link : undefined,
      items: itemsToConfigItems(linkItems, link || prefix),
      collapsed: true,
    });
  }

  return result;
}

/**
 * Creates a new config item generator.
 * @param prefix - items' link prefix.
 */
export function sectionGen(prefix: string) {
  return (title: string, items: Items): ConfigItem => ({
    text: title,
    items: itemsToConfigItems(items, prefix),
  });
}