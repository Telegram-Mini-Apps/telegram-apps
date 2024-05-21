type Item = string | null | boolean | undefined;

export function lines(...arr: (Item | Item[])[]): string {
  return arr.flat(1).filter(v => typeof v === 'string').join('\n');
}
