import { type ReactNode, useMemo } from 'react';
import { useInitData, retrieveLaunchParams, type User } from '@tma.js/sdk-react';

import { DisplayData, type DisplayDataRow } from '@/components/DisplayData/DisplayData';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page/Page';
import { useDidMount } from '@/hooks/useDidMount';

import styles from './styles.module.css';

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
}

export default function InitDataPage() {
  const didMount = useDidMount();
  const initData = useInitData(true);
  const initDataRaw = useMemo(() => didMount ? retrieveLaunchParams().initDataRaw : '', [didMount]);

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initData || !initDataRaw) {
      return;
    }
    const {
      hash,
      queryId,
      chatType,
      chatInstance,
      authDate,
      startParam,
      canSendAfter,
      canSendAfterDate,
    } = initData;
    return [
      { title: 'raw', value: initDataRaw },
      { title: 'auth_date', value: authDate.toLocaleString() },
      { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
      { title: 'hash', value: hash },
      { title: 'can_send_after', value: canSendAfterDate?.toISOString() },
      { title: 'can_send_after (raw)', value: canSendAfter },
      { title: 'query_id', value: queryId },
      { title: 'start_param', value: startParam },
      { title: 'chat_type', value: chatType },
      { title: 'chat_instance', value: chatInstance },
    ];
  }, [initData, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.receiver ? getUserRows(initData.receiver) : undefined;
  }, [initData]);

  const chatRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initData?.chat) {
      return;
    }
    const { id, title, type, username, photoUrl } = initData.chat;

    return [
      { title: 'id', value: id.toString() },
      { title: 'title', value: title },
      { title: 'type', value: type },
      { title: 'username', value: username },
      { title: 'photo_url', value: photoUrl },
    ];
  }, [initData]);

  let contentNode: ReactNode;

  if (!initDataRows) {
    contentNode = <i>Application was launched with missing init data</i>;
  } else {
    contentNode = (
      <>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Init data</h2>
          <DisplayData rows={initDataRows}/>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>User</h2>
          {userRows
            ? <DisplayData rows={userRows}/>
            : <i>User information missing</i>}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Receiver</h2>
          {receiverRows
            ? <DisplayData rows={receiverRows}/>
            : <i>Receiver information missing</i>}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Chat</h2>
          {chatRows
            ? <DisplayData rows={chatRows}/>
            : <i>Chat information missing</i>}
        </div>
      </>
    );
  }

  return (
    <Page
      title="Init Data"
      disclaimer={(
        <>
          This page displays application
          {' '}
          <Link href="https://docs.telegram-mini-apps.com/platform/init-data">
            init data
          </Link>
          .
        </>
      )}
    >
      {contentNode}
    </Page>
  );
};
