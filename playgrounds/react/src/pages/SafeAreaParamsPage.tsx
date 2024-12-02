import {
  safeAreaInset,
  contentSafeAreaInset,
  useSignal,
} from '@telegram-apps/sdk-react';

import {List} from '@telegram-apps/telegram-ui';
import {FC, useEffect, useState} from 'react';

import {DisplayData, DisplayDataRow} from '@/components/DisplayData/DisplayData.tsx';
import {Page} from '@/components/Page.tsx';

export const SafeAreaParamsPage: FC = () => {
  const inset = useSignal(safeAreaInset);
  const contentInset = useSignal(contentSafeAreaInset);

  const [safeAreaRows, setSafeAreaRows] = useState<DisplayDataRow[]>([]);
  const [contentSafeAreaRows, setContentSafeAreaRows] = useState<DisplayDataRow[]>([]);

  const getRows = (fn: typeof inset): DisplayDataRow[] => {
    return [
      {title: 'top', value: fn.top},
      {title: 'bottom', value: fn.bottom},
      {title: 'left', value: fn.left},
      {title: 'right', value: fn.right},
    ];
  }

  useEffect(() => {
    setSafeAreaRows(getRows(inset));
  }, [inset]);

  useEffect(() => {
    setContentSafeAreaRows(getRows(contentInset));
  }, [contentInset]);

  return (
    <Page>
      <List>
        <DisplayData
          header={'Safe Area Data'}
          rows={safeAreaRows}
        />
        <DisplayData
          header={'Content Safe Area Data'}
          rows={contentSafeAreaRows}
        />
      </List>
    </Page>
  );
};
