import {
  SDKProvider,
  useBackButton,
  retrieveLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars, bindViewportCSSVars,
} from '@tma.js/sdk-react';
import { type FC, useEffect, useMemo } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useRouter as useNavigationRouter } from 'next/navigation';

import { ErrorBoundary } from '@/components/ErrorBoundary';

import './global.css';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

const BackButtonManipulator: FC = () => {
  const router = useRouter();
  const { back } = useNavigationRouter();
  const bb = useBackButton({ ssr: { version: '7.0' } });

  useEffect(() => {
    if (router.pathname === '/') {
      bb.hide();
    } else {
      bb.show();
    }
  }, [router, bb]);

  useEffect(() => bb.on('click', back), [bb, back]);

  return null;
};

const App: FC<AppProps> = ({ pageProps, Component }) => {
  // As long as this is not really important to specify some valid SSR values here, we are just
  // specifying a stub.
  const ssrStub = {
    themeParams: {},
    version: '7.0',
    botInline: false,
    platform: 'unknown',
  };
  const miniApp = useMiniApp({ ssr: ssrStub });
  const themeParams = useThemeParams({ ssr: ssrStub });
  const viewport = useViewport({ ssr: ssrStub });

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    if (viewport) {
      return bindViewportCSSVars(viewport);
    }
  }, [viewport]);

  return (
    <>
      <BackButtonManipulator/>
      <Component {...pageProps}/>
    </>
  );
};

const Inner: FC<AppProps> = (props) => {
  const debug = useMemo(() => {
    return typeof window === 'undefined' ? false : retrieveLaunchParams().startParam === 'debug';
  }, []);
  const manifestUrl = useMemo(() => {
    return typeof window === 'undefined'
      ? ''
      : new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  useEffect(() => {
    if (debug) {
      import('eruda').then(lib => lib.default.init());
    }
  }, [debug]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <SDKProvider acceptCustomStyles debug={debug}>
        <App {...props}/>
      </SDKProvider>
    </TonConnectUIProvider>
  );
};

export default function CustomApp(props: AppProps) {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <Inner {...props}/>
    </ErrorBoundary>
  );
};
