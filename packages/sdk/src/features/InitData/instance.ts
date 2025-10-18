import { retrieveRawInitDataFp, retrieveLaunchParamsFp } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

import { InitData } from '@/features/InitData/InitData.js';

export const initData = new InitData({
  retrieveInitData() {
    return pipe(
      E.Do,
      E.bindW('obj', () => pipe(
        retrieveLaunchParamsFp(),
        E.map(({ tgWebAppData }) => {
          return tgWebAppData ? O.some(tgWebAppData) : O.none;
        }),
      )),
      E.bindW('raw', retrieveRawInitDataFp),
      E.map(({ obj, raw }) => {
        return pipe(
          O.Do,
          O.bind('obj', () => obj),
          O.bind('raw', () => raw),
        );
      }),
    );
  },
});
