import { classNames, isRecord } from '@tma.js/sdk';

type ModsValue = boolean | undefined | null | string;

interface CalcOptions {
  mix?: ModsValue | ModsValue[] | Record<string, any> | any;
  mods?: ModsValue | ModsValue[] | Record<string, ModsValue | ModsValue[]> | any;
}

export class BemElemClassNames {
  constructor(public readonly name: string) {
  }

  private withMod(mod: any): string {
    const v = classNames(mod);
    return v && `${this.name}--${v}`;
  }

  mods(...mods: ModsValue[]): string {
    const { name } = this;

    return classNames(
      mods.map((item) => {
        if (Array.isArray(item)) {
          return item.map((m) => this.withMod(m));
        }

        if (isRecord(item)) {
          return Object.entries(item).map(([mod, v]) => v && `${name}--${mod}`);
        }

        return this.withMod(item);
      }),
    );
  }

  calc({ mix, mods }: CalcOptions = {}) {
    return classNames(mix, this.name, this.mods(mods));
  }
}
