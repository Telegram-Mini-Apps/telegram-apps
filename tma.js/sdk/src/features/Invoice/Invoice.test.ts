import { describe, expect, it, vi } from 'vitest';
import * as TE from 'fp-ts/TaskEither';
import type { RequestFpFn } from '@tma.js/bridge';

import { Invoice } from '@/features/Invoice/Invoice.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { testComponentMethodSafety } from '@test-utils/predefined/testComponentMethodSafety.js';

const MIN_VERSION = '6.1';

function instantiate({
  version = MIN_VERSION,
  request = () => TE.right(undefined),
  isTma = true,
}: {
  version?: string;
  request?: RequestFpFn;
  isTma?: boolean;
} = {}) {
  return new Invoice({ version, request, isTma });
}

describe.each([
  ['open', (component: Invoice) => component.open('$a')],
] as const)('%s', (method, tryCall) => {
  describe('safety', () => {
    testComponentMethodSafety({
      instantiate,
      get: instance => instance[method],
      try: tryCall,
      minVersion: MIN_VERSION,
    });
  });
});

describe('open', () => {
  it(
    'should call request with "web_app_open_invoice", "invoice_closed" and params = { slug }',
    async () => {
      const request = vi.fn(() => TE.right({ status: 'paid' }));
      const component = instantiate({ request });
      await component.open('$a');
      expect(request).toHaveBeenCalledOnce();
      expect(request)
        .toHaveBeenCalledWith('web_app_open_invoice', 'invoice_closed', expect.objectContaining({
          params: { slug: '$a' },
        }));
    },
  );
});

describe('isSupported', () => {
  testIsSupported(version => instantiate({ isTma: true, version }), MIN_VERSION);
});
