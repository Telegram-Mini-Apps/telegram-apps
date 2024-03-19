import { BemElemClassNames } from '~/styles/bem/BemElemClassNames.js';

export class BemBlockClassNames extends BemElemClassNames {
  elem(name: string): BemElemClassNames {
    return new BemElemClassNames(`${this.name}__${name}`);
  }
}
