type Item = string | null | boolean | undefined;

export function spaces(...arr: (Item | Item[])[]): string {
  return arr.flat(1).filter(v => typeof v === 'string').join(' ');
}
