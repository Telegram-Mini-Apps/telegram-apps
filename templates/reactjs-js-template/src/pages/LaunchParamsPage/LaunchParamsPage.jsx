import { useLaunchParams } from '@tma.js/sdk-react';

import { DisplayData } from '@/components/DisplayData/DisplayData.jsx';
import { Link } from '@/components/Link/Link.jsx';
import { Page } from '@/components/Page/Page.jsx';

/**
 * @returns {JSX.Element}
 */
export function LaunchParamsPage() {
  const lp = useLaunchParams();

  return (
    <Page
      title="Launch Params"
      disclaimer={(
        <>
          This page displays application
          {' '}
          <Link to="https://docs.telegram-mini-apps.com/platform/launch-parameters">
            launch parameters
          </Link>
          .
        </>
      )}
    >
      <DisplayData
        rows={[
          { title: 'tgWebAppPlatform', value: lp.platform },
          { title: 'tgWebAppShowSettings', value: lp.showSettings },
          { title: 'tgWebAppVersion', value: lp.version },
          { title: 'tgWebAppBotInline', value: lp.botInline },
          { title: 'tgWebAppStartParam', value: lp.showSettings },
          { title: 'tgWebAppData', value: <Link to="/init-data">View</Link> },
          { title: 'tgWebAppThemeParams', value: <Link to="/theme-params">View</Link> },
        ]}
      />
    </Page>
  );
}
