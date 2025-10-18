import { pipe } from 'fp-ts/function';

import { Invoice } from '@/features/Invoice/Invoice.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withRequest } from '@/fn-options/withRequest.js';
import { withVersion } from '@/fn-options/withVersion.js';

export const invoice = new Invoice(pipe(sharedFeatureOptions(), withRequest, withVersion));
