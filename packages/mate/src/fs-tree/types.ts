interface Shared<T extends string> {
  type: T;
  name: string;
  relative: string;
}

export interface TreeDir extends Shared<'dir'> {
  items: Record<string, TreeItem>;
}

export type TreeFile = Shared<'file'>;

export type TreeItem = TreeDir | TreeFile;
