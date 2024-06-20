import { useThemeParams } from '@tma.js/sdk-react';
import type { FC } from 'react';
import { List } from '@telegram-apps/telegram-ui';

import { DisplayData } from '@/components/DisplayData/DisplayData.tsx';

export const ThemeParamsPage: FC = () => {
  const themeParams = useThemeParams();

  return (
    <List>
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
    </List>
  );
};
