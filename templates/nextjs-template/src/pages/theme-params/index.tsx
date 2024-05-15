import { useThemeParams } from '@tma.js/sdk-react';

import { DisplayData } from '@/components/DisplayData/DisplayData';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page/Page';
import { useDidMount } from '@/hooks/useDidMount';

function Inner() {
  const themeParams = useThemeParams();

  return (
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
  );
}

export default function ThemeParamsPage() {
  const didMount = useDidMount();

  return (
    <Page
      title="Theme Params"
      disclaimer={(
        <>
          This page displays current
          {' '}
          <Link href="https://docs.telegram-mini-apps.com/platform/theming">
            theme parameters
          </Link>
          . It is reactive, so, changing theme externally will lead to this page updates.
        </>
      )}
    >
      {didMount ? <Inner/> : 'Loading'}
    </Page>
  );
};
