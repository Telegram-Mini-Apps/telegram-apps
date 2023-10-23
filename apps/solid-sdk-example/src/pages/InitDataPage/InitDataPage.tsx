import { Match, Switch } from 'solid-js';
import { useSDK } from '@tma.js/sdk-solid';
import type { Chat, User } from '@tma.js/init-data';

import { Link } from '../../components/Link';
import { DisplayData, type Line } from '../../components/DisplayData';

import styles from './styles.module.css';

function getUserLines(user: User): Line[] {
  const {
    id,
    isBot,
    isPremium,
    languageCode = null,
    lastName = null,
    firstName,
  } = user;

  return [
    ['ID', id.toString()],
    ['Last name', lastName],
    ['First name', firstName],
    ['Is bot', isBot ? 'yes' : 'no'],
    ['Is premium', isPremium ? 'yes' : 'no'],
    ['Language code', languageCode],
  ];
}

function getChatLines(chat: Chat): Line[] {
  const {
    id,
    title,
    type,
    username = null,
    photoUrl = null,
  } = chat;

  return [
    ['ID', id.toString()],
    ['Title', title],
    ['Type', type],
    ['Username', username],
    ['Photo URL', photoUrl],
  ];
}

export function InitDataPage() {
  const { initData, initDataRaw } = useSDK();
  const whenWithData = () => {
    const typed = initData();
    const raw = initDataRaw();

    return typed && raw ? { typed, raw } : false;
  };

  return (
    <div class={styles.root}>
      <Link class={styles.link} href="/theme-params">
        To theme parameters
      </Link>
      <Switch fallback={'Current launch parameters don\'t contain init data information.'}>
        <Match when={whenWithData()}>
          {(match) => {
            const lines = (): Line[] => {
              const {
                authDate,
                chat,
                hash,
                canSendAfter,
                queryId,
                receiver,
                user,
                startParam,
                chatType,
                chatInstance,
              } = match().typed;

              return [
                ['Raw', match().raw],
                ['Auth date', authDate.toLocaleString()],
                ['Hash', hash],
                ['Can send after', canSendAfter ? canSendAfter.toString() : null],
                ['Query id', queryId],
                ['Start param', startParam],
                ['Chat type', chatType],
                ['Chat instance', chatInstance],
                ['Receiver', receiver ? getUserLines(receiver) : null],
                ['Chat', chat ? getChatLines(chat) : null],
                ['User', user ? getUserLines(user) : null],
              ];
            };

            return <DisplayData title="Init data" lines={lines()}/>;
          }}
        </Match>
      </Switch>
    </div>
  );
}