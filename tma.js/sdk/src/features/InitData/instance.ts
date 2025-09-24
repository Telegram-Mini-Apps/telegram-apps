import { retrieveRawInitDataFp, retrieveLaunchParamsFp } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

import { InitData } from '@/features/InitData/InitData.js';

export const initData = new InitData({
  retrieveRawInitData: retrieveRawInitDataFp,
  retrieveInitData() {
    return pipe(
      retrieveLaunchParamsFp(),
      E.map(({ tgWebAppData }) => {
        return tgWebAppData ? O.some(tgWebAppData) : O.none;
      }),
    );
  },
});
