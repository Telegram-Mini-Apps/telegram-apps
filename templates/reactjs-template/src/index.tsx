import ReactDOM from 'react-dom/client';
import { mockTelegramEnv } from '@tma.js/sdk-react';

import { Root } from '@/components/Root';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

// This line of code allows us to safely launch the application even outside
// the Telegram application. It will also only be applied in development mode, not in
// production.
if (import.meta.env.DEV) {
  mockTelegramEnv({
    themeParams: {
      accentTextColor: '#6ab2f2',
      bgColor: '#17212b',
      buttonColor: '#5288c1',
      buttonTextColor: '#ffffff',
      destructiveTextColor: '#ec3942',
      headerBgColor: '#17212b',
      hintColor: '#708499',
      linkColor: '#6ab3f3',
      secondaryBgColor: '#232e3c',
      sectionBgColor: '#17212b',
      sectionHeaderTextColor: '#6ab3f3',
      subtitleTextColor: '#708499',
      textColor: '#f5f5f5',
    },
    initData: {
      authDate: new Date(1716922846000),
      chatInstance: '8428209589180549439',
      chatType: 'sender',
      hash: '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
      startParam: 'debug',
      user: {
        allowsWriteToPm: true,
        firstName: 'Andrew',
        id: 99281932,
        isPremium: true,
        languageCode: 'en',
        lastName: 'Rogue',
        username: 'rogue',
      },
    },
    initDataRaw: 'user=%7B%22id%22%3A99281932%2C%22first_name%22%3A%22Andrew%22%2C%22last_name%22%3A%22Rogue%22%2C%22username%22%3A%22rogue%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8428209589180549439&chat_type=sender&start_param=debug&auth_date=1716922846&hash=89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
    version: '7.2',
    platform: 'tdesktop',
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root/>);
