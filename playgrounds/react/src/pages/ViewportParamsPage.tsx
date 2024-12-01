import { viewport, useSignal } from '@telegram-apps/sdk-react';
import type { FC } from 'react';
import { List } from '@telegram-apps/telegram-ui';

import { DisplayData } from '@/components/DisplayData/DisplayData.tsx';
import { Page } from '@/components/Page.tsx';

export const ViewportParamsPage: FC = () => {
  const vp = useSignal(viewport.state);

  return (
    <Page>
      <List>
        <DisplayData
          rows={
            Object
              .entries(vp)
              .map(([title, value]) => ({
                title: title
                  .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
                value,
              }))
          }
        />
      </List>
    </Page>
  );
};
