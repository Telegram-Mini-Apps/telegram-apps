import React from 'react';
import {useIsWebAppEnv} from '@site/src/hooks';
import {DefaultLayout, WebAppLayout} from '@site/src/components/home';

/**
 * Index entry for whole documentation.
 * @constructor
 */
export default function Home(): JSX.Element {
  return useIsWebAppEnv() ? <WebAppLayout/> : <DefaultLayout/>;
}
