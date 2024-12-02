import {
  hapticFeedback,
  useSignal,
  viewport
} from '@telegram-apps/sdk-react';

import {Button, List} from '@telegram-apps/telegram-ui';
import {FC, useEffect, useState} from 'react';

import {DisplayData, DisplayDataRow} from '@/components/DisplayData/DisplayData.tsx';
import {Page} from '@/components/Page.tsx';

export const ViewportParamsPage: FC = () => {
  const viewportState = useSignal(viewport.state);
  const inset = useSignal(viewport.safeAreaInsets);
  const contentInset = useSignal(viewport.contentSafeAreaInsets);

  const [modeRows, setModeRows] = useState<DisplayDataRow[]>([]);
  const [viewportRows, setViewportRows] = useState<DisplayDataRow[]>([]);
  const [safeAreaRows, setSafeAreaRows] = useState<DisplayDataRow[]>([]);
  const [contentSafeAreaRows, setContentSafeAreaRows] = useState<DisplayDataRow[]>([]);

  const getSafeAreaRows = (fn: typeof inset): DisplayDataRow[] => {
    return [
      {title: 'top', value: fn.top},
      {title: 'bottom', value: fn.bottom},
      {title: 'left', value: fn.left},
      {title: 'right', value: fn.right},
    ];
  }

  useEffect(() => {
    setModeRows([
      {title: "is_fullscreen", value: viewportState.isFullscreen},
      {title: "is_expanded", value: viewportState.isExpanded},
    ]);

    setViewportRows([
      {title: "height", value: viewportState.height},
      {title: "width", value: viewportState.width},
      {title: "stable_height", value: viewportState.stableHeight},
    ]);
  }, [viewportState]);

  useEffect(() => {
    setSafeAreaRows(getSafeAreaRows(inset));
  }, [inset]);

  useEffect(() => {
    setContentSafeAreaRows(getSafeAreaRows(contentInset));
  }, [contentInset]);

  const requestFullscreen = () => {
    hapticFeedback.impactOccurred("medium");
    void viewport.requestFullscreen();
  }

  const exitFullscreen = () => {
    hapticFeedback.impactOccurred("medium");
    void viewport.exitFullscreen();
  }

  return (
    <Page>
      <div style={{
        display: "flex",
        padding: "1rem",
        gap: "1rem",
      }}>
        <Button
          mode="filled"
          size="l"
          onClick={requestFullscreen}
          style={{flex: "1 1 0%"}}
        >
          Request fullscreen
        </Button>
        <Button
          mode="filled"
          size="l"
          onClick={exitFullscreen}
          style={{flex: "1 1 0%"}}
        >
          Exit fullscreen
        </Button>
      </div>
      <List>
        <DisplayData
          header={'App mode'}
          rows={modeRows}
        />
        <DisplayData
          header={'Viewport Data'}
          rows={viewportRows}
        />
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
