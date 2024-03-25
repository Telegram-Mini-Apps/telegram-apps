import type { WithConfigComponent } from '~/hocs/withConfig.js';

import { RipplesCore } from '~/components/Ripples/RipplesCore.js';
import type { RipplesCustomProps, RipplesProps } from '~/components/Ripples/Ripples.types.js';

export interface RipplesComponent extends WithConfigComponent<RipplesProps> {
  Custom: WithConfigComponent<RipplesCustomProps>;
}

export const Ripples = RipplesCore as RipplesComponent;

Ripples.Custom = RipplesCore as WithConfigComponent<RipplesCustomProps>;
