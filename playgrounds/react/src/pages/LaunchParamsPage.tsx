import { useLaunchParams } from '@telegram-apps/sdk-react';
import { List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { DisplayData } from '@/components/DisplayData/DisplayData.tsx';
import { Page } from '@/components/Page.tsx';

export const LaunchParamsPage: FC = () => {
  const lp = useLaunchParams();

  return (
    <Page>
      <List>
        <DisplayData
          rows={[
            { title: 'tgWebAppPlatform', value: lp.platform },
            { title: 'tgWebAppShowSettings', value: lp.showSettings },
            { title: 'tgWebAppVersion', value: lp.version },
            { title: 'tgWebAppBotInline', value: lp.botInline },
            { title: 'tgWebAppStartParam', value: lp.startParam },
            { title: 'tgWebAppData', type: 'link', value: '/init-data' },
            { title: 'tgWebAppThemeParams', type: 'link', value: '/theme-params' },
          ]}
        />
      </List>
    </Page>
  );
};
