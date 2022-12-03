import {SDKProvider, useSDK, useWebApp} from 'twa-sdk-react';
import {Redirect} from '@docusaurus/router';
import React, {FC, PropsWithChildren, useEffect} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import {INITIAL_PAGE_PATH} from '@site/src/constants';
import Layout from '@theme/Layout';

/**
 * Renders layout content.
 * @constructor
 */
const App: FC = () => {
  const {setColorMode} = useColorMode();
  const {colorScheme} = useWebApp();

  // When components are loaded, we should actualize documentation color
  // scheme. Somehow, docusaurus is unable to specify it correctly.
  useEffect(() => {
    setColorMode(colorScheme);
  }, [colorScheme]);

  return (
    <>
      <Redirect to={INITIAL_PAGE_PATH}/>
    </>
  );
};

/**
 * Loads Web Apps SDK and renders provided children inside `Layout` component.
 * @constructor
 */
const LoadedLayout: FC<PropsWithChildren> = ({children}) => {
  const {components} = useSDK();

  return components === null
    ? null
    : <Layout noFooter={true}>{children}</Layout>;
};

/**
 * Component which is rendered in case, current environment is Web App.
 * @constructor
 */
export const WebAppLayout: FC = () => {
  return (
    <SDKProvider>
      <LoadedLayout>
        <App/>
      </LoadedLayout>
    </SDKProvider>
  );
};