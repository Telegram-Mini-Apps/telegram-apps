import { useLaunchParams, miniApp } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Outlet } from 'react-router-dom';

export function Layout() {
  const lp = useLaunchParams();

  return (
    <AppRoot
      appearance={miniApp.isDark() ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Outlet/>
    </AppRoot>
  );
}
