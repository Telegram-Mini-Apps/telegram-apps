type Items = Record<string, string | [link: string, items: Items, collapsed?: boolean]>;

function itemsToArray(items: Items, prefix: string) {
  const result = [];
  for (const text in items) {
    const linkOrItems = items[text];
    let link: string;
    let linkItems: Items | undefined;
    let collapsed: boolean | undefined;

    if (Array.isArray(linkOrItems)) {
      [link, linkItems, collapsed] = linkOrItems;
    } else {
      link = linkOrItems;
    }
    const computedLink = prefix + (link[0] === '/' ? '' : '/') + link;

    result.push({
      text,
      link: computedLink,
      items: itemsToArray(linkItems || {}, computedLink),
      collapsed,
    });
  }
  return result;
}

function section(text: string, items: Items, prefix: string) {
  return { text, items: itemsToArray(items, prefix) };
}

export function sectionGen(prefix: string) {
  return (text: string, items: Items) => {
    return section(text, items, prefix);
  };
}