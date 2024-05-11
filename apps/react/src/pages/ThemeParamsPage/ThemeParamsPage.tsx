import { useThemeParams } from '@tma.js/sdk-react';
import type { FC } from 'react';

import { DisplayData } from '@/components/DisplayData/DisplayData.tsx';
import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page/Page.tsx';

export const ThemeParamsPage: FC = () => {
  const themeParams = useThemeParams();

  return (
    <Page
      title="Theme Params"
      disclaimer={(
        <>
          This page displays current
          {' '}
          <Link to="https://docs.telegram-mini-apps.com/platform/theming">
            theme parameters
          </Link>
          . It is reactive, so, changing theme externally will lead to this page updates.
        </>
      )}
    >
      <DisplayData
        rows={
          Object
            .entries(themeParams.getState())
            .map(([title, value]) => ({
              title: title
                .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
                .replace(/background/, 'bg'),
              value,
            }))
        }
      />
    </Page>
  );
};
