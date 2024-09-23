interface Items {
  [Title: string]:
    | string
    | Items
    | [itemUrlOrOptions: string | { url: string; page?: boolean }, items: Items];
}

interface ConfigItem {
  text: string;
  link?: string;
  items: ConfigItem[];
  collapsed: boolean;
}

function localItemsToConfigItems(items: Items, prefix: string): ConfigItem[] {
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
      items: localItemsToConfigItems(linkItems, link || prefix),
      collapsed: true,
    });
  }

  return result;
}

function section(text: string, items: Items, prefix: string) {
  return {
    text,
    items: localItemsToConfigItems(items, prefix),
  };
}

export function sectionGen(prefix: string) {
  return (text: string, items: Items) => {
    console.log(section(text, items, prefix));
    return section(text, items, prefix);
  };
}